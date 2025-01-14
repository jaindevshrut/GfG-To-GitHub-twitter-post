from mira_sdk import MiraClient, Flow, ComposioConfig

# Initialize Mira client with your API key
client = MiraClient(config={"API_KEY": "sb-f0548e40fea9328a2be1913f0e965a95"})


flow = "jaindevshrut/tweet-generator"

# Set up your flow's input parameters
input_dict = {
    "question" : "create a array",
    "desc": "create a array with 5 natural numbers",
}

# Execute flow with Composio integration
# The flow's output will automatically replace {content} in the TASK
response = client.flow.execute(
    flow,
    input_dict,
    ComposioConfig(
        COMPOSIO_API_KEY="zfwbb8nesgeohr8rxqrieo",
        ACTION="TWITTER_CREATION_OF_A_POST",  # This is the Enum e.g., "TWITTER_POST", "DISCORD_SEND"
        TASK="Post this tweet: {content}",  # {content} is required and gets replaced with flow output
        ENTITY_ID="jaindevshrut"  # Platform-specific identifier
    )
)
print(response)