from langchain_community.llms.llamacpp import LlamaCpp
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


MODEL_PATH = "model_quantized.q4.gguf"

prompt = PromptTemplate.from_template(  
    """You are a QA automation expert. Output only a **single valid Gherkin scenario** using the user story below.

Your output must follow *exactly* this format and structure:

Feature: <short feature name>

  Scenario: <concise scenario title>
    Given <initial condition>
    When <trigger action>
    Then <result>

User story: {input}
"""
)

llm = None
chain = None

def generate_gherkin(user_story: str) -> str:
    global llm, chain
    if llm is None:
        llm = LlamaCpp(
            model_path=MODEL_PATH,
            n_ctx=512,
            temperature=0.7,
            top_p=0.95,
            n_gpu_layers=0,
            n_batch=8,
            verbose=False,
        )

        chain = prompt | llm | StrOutputParser()
    return chain.invoke({"input": user_story})

