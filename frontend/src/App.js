import { Container, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import { InputText } from "./components/inputText";
import { ScrapeAndStopWords } from "./components/scrapeAndStopWords";
import { Analysis } from "./components/analysis";
import { Navbar } from "./components/navbar";
import { removeQueryParams } from "./utils";

const STEPS = [
  {
    id: "input",
    label: "Input Text",
  },
  {
    id: "stop_words",
    label: "Scarpping and Stop Words",
  },
  {
    id: "Analysis",
    label: "Analysis",
  },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  return (
    <>
      <Navbar
        onReset={() => {
          setCurrentStep(0);
          setError(null);
          removeQueryParams();
        }}
      />
      <Container
        component="section"
        maxWidth="none"
        sx={{
          my: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          sx={{ width: "100%" }}
        >
          {STEPS.map((step, index) => (
            <Step key={step.id}>
              <StepLabel error={currentStep === index && !!error}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {currentStep === 0 && (
          <InputText
            onComplete={(message) => {
              alert(message);
              setCurrentStep((prev) => prev + 1);
            }}
            onSetError={(hasError) => setError(hasError)}
          />
        )}
        {currentStep === 1 && (
          <ScrapeAndStopWords
            onSetError={(hasError) => setError(hasError)}
            onComplete={(message) => {
              alert(message);
              setCurrentStep((prev) => prev + 1);
            }}
          />
        )}
        {currentStep === 2 && <Analysis />}
      </Container>
    </>
  );
}

export default App;
