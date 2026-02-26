-Experience


Input
View Examples
Video Input
set_of_mark.mp4
.mp4
User Prompt
Your question or task. Aim 20-150 tokens (~15-115 words); max 250 tokens.
Which worker picked up the dropped box?
39/250
System Prompt
Defines AI role/rules for session. Aim 100-400 tokens (~75-300 words); max 1,000 tokens. Model can accommodate reasoning or non-reasoning answers. Enable reasoning by including this text string in the system prompt:<think>your reasoning</think><answer>your answer</answer>
You are a helpful warehouse monitoring system. The provided video is a processed clip where each worker is overlaid with an ID. You must refer to the worker based on the ID overlaid on the worker in the video.<think>
your reasoning, with reference to worker IDs shown in the video
</think>

<answer>
your answer, with reference to worker IDs shown in the video
</answer>.
371/4000

Hide Parameters
Temperature
0.6
Top P
0.95
Repetition Penalty
1.05
FPS
4
Seed
Seed
Number
vLLM Seed is set to 21 for demonstration purposes

21

Reasoning

---------------------------------------------

-Deploy

nvidia
cosmos-reason1-7b
Deprecation in 20d
Downloadable
Reasoning vision language model (VLM) for physical AI and robotics.

Physical AI
autonomous vehicles
industrial
reasoning
robotics
smart cities
Synthetic Data Generation
video understanding
vision language model
Get API Key
Experience
Model Card
Deploy
Select your target environment

Linux with Docker
Deploying your application in production? Get started with a 90-day evaluation of NVIDIA AI Enterprise
Get NVIDIA AI Enterprise
Follow the steps below to download and run the NVIDIA NIM inference microservice for this model on your infrastructure of choice.

Step 1
Generate API Key
Get API Key
Step 2
Pull and Run the NIM
Bash

Copy
$ docker login nvcr.io
Username: $oauthtoken
Password: <PASTE_API_KEY_HERE>
Pull and run the NVIDIA NIM with the command below. This will download the optimized model for your infrastructure.

Bash

Copy
export NGC_API_KEY=<PASTE_API_KEY_HERE>
export LOCAL_NIM_CACHE=~/.cache/nim
mkdir -p "$LOCAL_NIM_CACHE"
docker run -it --rm \
    --gpus all \
    --ipc host \
    --shm-size=32GB \
    -e NGC_API_KEY \
    -v "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
    -u $(id -u) \
    -p 8000:8000 \
    nvcr.io/nim/nvidia/cosmos-reason1-7b:latest
Step 3
Test the NIM
You can now make a local API call using this curl command:

Bash

Copy
curl -X 'POST' \
'http://0.0.0.0:8000/v1/chat/completions' \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
        "model": "nvidia/cosmos-reason1-7b",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What is in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://www.nvidia.com/content/dam/en-zz/Solutions/about-nvidia/logo-and-brand/01-nvidia-logo-vert-500x200-2c50-d.png"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 256
    }'
For more details on getting started with this NIM, visit the NVIDIA NIM Docs.