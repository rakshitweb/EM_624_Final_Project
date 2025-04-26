import { Container, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import { InputText } from "./components/inputText";

const STEPS = [
  {
    id: "input",
    label: "Input Text",
  },
  {
    id: "scraping",
    label: "Scraped Text",
  },
  {
    id: "stop_words",
    label: "Stop Words",
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
      <Stepper activeStep={currentStep} alternativeLabel sx={{ width: "100%" }}>
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
    </Container>
  );
}

export default App;
