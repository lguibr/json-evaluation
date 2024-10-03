# JSON Comparison and Evaluation Tool

![Project Banner](https://via.placeholder.com/1200x300?text=JSON+Comparison+and+Evaluation+Tool)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Step-by-Step Guide](#step-by-step-guide)
- [Technology Stack](#technology-stack)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Introduction

Welcome to the **JSON Comparison and Evaluation Tool**! This powerful web application is designed to help developers and data analysts effortlessly compare two JSON files, particularly focusing on evaluating JSON outputs from Large Language Models (LLMs). By leveraging advanced similarity metrics and user-defined configurations, this tool provides a comprehensive analysis of JSON data, ensuring accuracy and consistency in your AI-generated outputs.

## Features

- **User-Friendly Interface:** Intuitive design for seamless navigation and operation.
- **JSON Upload:** Easily upload and manage JSON files for comparison.
- **Advanced Comparison Metrics:**
  - **Semantic Similarity:** Utilize OpenAI embeddings to assess the semantic closeness of JSON values.
  - **Levenshtein Distance:** Measure the difference between strings to evaluate similarity.
  - **Date-Time Comparison:** Intelligent parsing and comparison of date-time values.
- **Custom Configurations:**
  - **Abbreviations and Synonyms:** Define and manage abbreviations to enhance comparison accuracy.
  - **Weight Configuration:** Assign weights to specific JSON keys to prioritize their significance in evaluations.
- **Result Visualization:**
  - **Detailed Result Tables:** View comprehensive comparison results with scores and reasons.
  - **Average Scores:** Instantly see unweighted and weighted average similarity scores.
- **Downloadable Reports:** Export comparison results in JSON format for further analysis.
- **Secure API Key Management:** Users can securely input and store their OpenAI API keys without exposing them in the codebase.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- **Node.js:** Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **npm or Yarn:** Package managers for installing dependencies.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/json-comparison-tool.git
   cd json-comparison-tool
   ```

2. **Install Dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables:**

   The application requires users to input their OpenAI API key through the interface. No additional environment variables are necessary at this stage.

### Running the Application

Start the development server with the following command:

Using npm:

```bash
npm start
```

Or using Yarn:

```bash
yarn start
```

The application will run at `http://localhost:3000`. Open this URL in your web browser to access the tool.

## Usage

### Step-by-Step Guide

1. **Launch the Application:**

   Open your browser and navigate to `http://localhost:3000`.

2. **Configure OpenAI API Key:**

   - Click on the **Settings** button located on the Home page.
   - In the **OpenAI API Key Configuration** section, enter your OpenAI API key.
   - Click **Save API Key** to store it securely in your browser's local storage.
   - *Note:* Ensure you do not share your API key publicly. The application masks the input for security.

3. **Create or Load a Project:**

   - **Create New Project:**
     - Click on **+ Create New Project**.
     - Enter a project name.
     - Define **Abbreviations and Synonyms** in JSON format to enhance comparison accuracy.
     - Configure **Weight Configuration** by providing a sample JSON and assigning weights to specific keys.
     - Click **Create Project** to save your configurations.
   
   - **Load Existing Project:**
     - If you have existing projects, they will be listed on the Home page.
     - Click **Load** on the desired project to use its configurations.

4. **Upload JSON Files:**

   - Navigate to the **File Upload** section.
   - **Left Upload:** Drag and drop or browse to upload JSON files representing the first dataset (e.g., JSON output from LLM 1).
   - **Right Upload:** Drag and drop or browse to upload JSON files representing the second dataset (e.g., JSON output from LLM 2).
   - Click **Match and Proceed** to automatically pair files based on their base names.

5. **Review Comparisons:**

   - After matching, navigate to the **JSON Comparisons** section.
   - Expand each comparison pair by clicking on them to view detailed results.
   - **Result Tables** display key-by-key similarity scores, reasons for similarity/difference, and weighted scores based on your configurations.
   - **Average Scores** provide an overall assessment of similarity between the two JSON files.

6. **Download Reports:**

   - Click **Download All Scores** to export the comparison results in JSON format for further analysis or record-keeping.

7. **Reset or Manage Projects:**

   - Use the **Reset Tool** button to clear all current data and configurations.
   - Manage your projects from the Home page by editing or deleting existing configurations.

## Technology Stack

- **Frontend:**
  - [React](https://reactjs.org/) - JavaScript library for building user interfaces.
  - [React Dropzone](https://react-dropzone.js.org/) - For file upload functionalities.
  - [LangChain](https://github.com/hwchase17/langchain) - To utilize OpenAI embeddings for semantic similarity.
  - [Chrono-node](https://github.com/wanasit/chrono) - For parsing and comparing date-time strings.
  
- **Styling:**
  - CSS - Custom styles for component-based design.

- **Utilities:**
  - **Local Storage:** For storing user configurations and API keys securely on the client side.
  - **OpenAI API:** For generating semantic embeddings to evaluate similarity.

## Security Considerations

- **API Key Management:**
  - Users are required to input their OpenAI API keys through the **Settings** section.
  - API keys are stored securely in the browser's local storage and are not exposed in the application's codebase.
  - The input field for the API key is masked to prevent shoulder surfing.
  
- **Data Privacy:**
  - JSON files uploaded by users are processed locally in the browser.
  - No data is sent to external servers unless making API calls to OpenAI for embeddings.
  
- **Best Practices:**
  - Always use HTTPS to ensure data is encrypted in transit.
  - Regularly review and manage stored API keys, especially when using shared or public devices.

## Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, or improvements, your input is invaluable.

1. **Fork the Repository:**

   Click the **Fork** button at the top-right corner of the repository page.

2. **Clone Your Fork:**

   ```bash
   git clone https://github.com/yourusername/json-comparison-tool.git
   cd json-comparison-tool
   ```

3. **Create a Branch:**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Your Changes:**

   Implement your feature or bug fix.

5. **Commit Your Changes:**

   ```bash
   git commit -m "Add feature: YourFeatureName"
   ```

6. **Push to Your Fork:**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Create a Pull Request:**

   Navigate to your fork on GitHub and click **New Pull Request**.

8. **Describe Your Changes:**

   Provide a clear description of what you've done and why.

9. **Submit the Pull Request:**

   Click **Create Pull Request** to notify the maintainers.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the license terms.

## Acknowledgements

- [React](https://reactjs.org/) for providing a robust framework for building user interfaces.
- [OpenAI](https://openai.com/) for their powerful API and embeddings used in semantic similarity evaluations.
- [LangChain](https://github.com/hwchase17/langchain) for enabling advanced language processing capabilities.
- [Chrono-node](https://github.com/wanasit/chrono) for accurate date-time parsing.
