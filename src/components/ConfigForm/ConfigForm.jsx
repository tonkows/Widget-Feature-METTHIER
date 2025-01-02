import React, { useState } from "react";
import styled from "styled-components";

const Configform = ({ isSidebarCollapsed }) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedTimeOptions, setSelectedTimeOptions] = useState({
    date: false,
    week: false,
    month: false,
    year: false,
  });

  const handleCheckboxChange = (option) => {
    setSelectedTimeOptions((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  return (
    <Container isSidebarCollapsed={isSidebarCollapsed}>
      <Card isSidebarCollapsed={isSidebarCollapsed}>
        <Header></Header>
        <Form>
          <Field>
            <Label>Select Subject:</Label>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">-- Select a Subject --</option>
            </Select>
          </Field>

          <Field>
            <Label>Select Dataset:</Label>
            <Select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
            >
              <option value="">-- Select a Dataset --</option>
              <option value="dataset1">Dataset 1</option>
              <option value="dataset2">Dataset 2</option>
              <option value="dataset3">Dataset 3</option>
            </Select>
          </Field>

          <Field>
            <Label>Select Time Options:</Label>
            <CheckboxGroup>
              {["date", "week", "month", "year"].map((option) => (
                <Checkbox key={option}>
                  <input
                    type="checkbox"
                    id={option}
                    checked={selectedTimeOptions[option]}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  <CheckboxLabel htmlFor={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </CheckboxLabel>
                </Checkbox>
              ))}
            </CheckboxGroup>
          </Field>
        </Form>
        <GenerateButton>Generate</GenerateButton>
      </Card>
    </Container>
  );
};

export default Configform;

// Styled Components
const Container = styled.div`
  background-color: var(--card-bg-color);
  color: var(--text-color);
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 80px 20px;
`;

const Card = styled.div`
  background-color: var(--background-color);
  width: 90%;
  max-width: 1500px;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  padding: 30px;
  margin-left: ${(props) => (props.isSidebarCollapsed ? "50px" : "250px")};
  transition: margin-left 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Form = styled.div``;

const Field = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid gray;
  background-color: var(--card-bg-color);
  color: var(--text-color);
  font-size: 14px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  margin-left: 8px;
  font-size: 14px;
`;

const GenerateButton = styled.button`
  background-color: var(--button-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  align-self: flex-start;

  &:hover {
    background-color: var(--button-color);
  }
`;
