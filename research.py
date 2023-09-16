import os
from dotenv import load_dotenv

from langchain import PromptTemplate
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from langchain.chat_models import ChatOpenAI
from langchain.prompts import MessagesPlaceholder
from langchain.memory import ConversationSummaryBufferMemory
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.summarize import load_summarize_chain
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type
from bs4 import BeautifulSoup
import requests
import json
import streamlit as st
from langchain.schema import SystemMessage

#load api keys
load_dotenv()
browserless_api_key = os.getenv("BROWSERLESS_API_KEY")
serper_api_key = os.getenv("SERP_API_KEY")


# 1. Tool for search
def search(query):

    url = "https://google.serper.dev/search"

    payload = json.dumps({
        "q": query
    })

    headers = {
        'X-API-KEY': serper_api_key,
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)

    return response.text

# 2. Tool for scraping
def scrape_website(objective: str, url: str):
    # scrape website, summarize content based on objective if the content is (too long?)
    # objective is the original objective and task that the user gives to the agent
    # url is idk

    print("Scraping website...")

    #Define the headers for the website request
    headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
    }

    #data to send in the request
    data = {
        "url": url
    }

    # Convert Python object to JSON string
    data_json = json.dumps(data)

    # Send the POST request
    post_url = f"https://chrome.browserless.io/content?token={browserless_api_key}"
    response = requests.post(post_url, headers=headers, data=data_json)

    # Check the response status code
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        text = soup.get_text()
        print("CONTENTTTTTT:", text)

        if len(text) > 10000:
            output = summary(objective, text)
            return output
        else:
            return text
        
    else:
        print(f"HTTP request failed with status code {response.status_code}")

# because chat gpt 3.5 has a limit of 4096 tokens for an input we need to reduce or summarize the input
def summary(objective, content):

    # get learning language model from chat gpt
    llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k-0613")

    # breaks down page content into chunks- 10,000 tokens in each chunk
    text_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n"], chunk_size=10000, chunk_overlap=500)
    
    # array of the chunks
    docs = text_splitter.create_documents([content])

    # prompt for the language model
    map_prompt = """
    Write a summary of the following text for {objective}:
    "{text}"
    SUMMARY:
    """

    # use above prompt in a template
    map_prompt_template = PromptTemplate(
        template=map_prompt, input_variables=["text", "objective"])
    
    # langchain's summarize chain function
    # will summarize the chunks from the map and merge them together into the combine prompt
    summary_chain = load_summarize_chain(
        llm=llm,
        chain_type='map_reduce',
        map_prompt=map_prompt_template,
        combine_prompt=map_prompt_template,
        verbose=True
    )

    # run the summary chain on the inputted documents
    output = summary_chain.run(input_documents=docs, objective=objective)

    return output

class ScrapeWebsiteInput(BaseModel):
    # need to make sure we have consistent performance with multiple inputs
    # defines a list of inputs for the agent to pass on
    objective: str = Field(description="The objective and task that users give to the agent")
    url: str = Field(description="The url of the website to be scraped")

class ScrapeWebsiteTool(BaseTool):
    # class to call scrape_website
    name = "scrape_website"
    description = "useful when you need to get data from a website url, passing both url and objective to the function; DO NOT make up any URL, it might mess up"
    args_schema: Type[BaseModel] = ScrapeWebsiteInput

    def _run(self, objective: str, url: str):
        return scrape_website(objective, url)
    
    def _arun(self, url: str):
        raise NotImplementedError("error here")

# 3. Create langchain agent with the tools above
tools = [
    Tool(
    # tool for the search function, simple
        name = "Search",
        func = search,
        description = "useful for when you need to answer questions about current events or data. You should ask targeted questions"
    ),
    # website scraping is more complicated, so needs custom tool class
    ScrapeWebsiteTool(),
]

# behaviour for the llm to follow
# make sure to repeats rules that need to be strictly adhered to
system_message = SystemMessage(
     content = """You are a world class researcher, who can do detailed research on any topic and produce facts based results;
     you do not make things up, you will try as hard as possible to gather facts and data to back up the research

     Please make sure you complete the objective above with the following rules:
     1/ You should do enough research to gather as much information as possible about the objective
     2/ If there are urls of relevant links and articles, you will scrape it to gather more information
     3/ After scraping and searching, you should think "are there any new things I should search and scrape based on the data I collected to increase research quality?" If the answer is yes, continue; But don't this for more than 3 iterations
     4/ You should not make things up, you should only write facts and data that you have gathered
     5/ In the final output, You should include all reference data and links to back up your research; You should include all reference data and links to back up your research
     6/ In the final output, You should include all reference data and links to back up your research; You should include all reference data and links to back up your research
     """
 )

# use to pass the prompt to the ideahackerlab agent
agent_kwargs = {
    "extra_prompt_messages": [MessagesPlaceholder(variable_name="memory")],
    "system_message": system_message,
}

llm = ChatOpenAI(temperature = 0, model = "gpt-3.5-turbo-16k-0613")
# use this so the agent can remember the context (word by word) of the recent chat history
# will remember exact word by word context from previous 1000 tokens
# anything after will get summarized 
memory = ConversationSummaryBufferMemory(memory_key="memory", return_messages=True, llm=llm, max_token_limit=1000)

# make agent
agent = initialize_agent(
    tools, # made above
    llm, # from chat gpt
    agent=AgentType.OPENAI_FUNCTIONS, # use because extracting functions are better
    verbose=True, # use to see what agent is thinking at every step
    agent_kwargs = agent_kwargs,
    memory = memory,
)

result = agent({"input": "How does CRISPR make the genes for a blonde baby?"})
print(result['output'])
#search("what is meta's thread product")
#scrape_website("what is langchain?", "https://python.langchain.com/en/latest/index.html")
