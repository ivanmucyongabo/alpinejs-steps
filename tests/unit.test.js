import { StepsComponent } from "../src/index";

describe("StepsComponent unit tests", () => {
  var steps, component;

  beforeAll(() => {
    steps = [
      {
        name: "1",
        isActive: false,
      },
      {
        name: "2",
        isActive: false,
      },
      {
        name: "3",
        isActive: false,
      },
    ];
    component = StepsComponent(steps);
  });

  describe("Getter Tests", () => {
    test("LengthGetterTest_ReturnNumberOfSteps", () => {
      expect(component.length).toBe(component.steps.length);
    });

    test("CurrentIndexGetterTest_ReturnIndexOfActiveStep", () => {
      expect(component.currentStepIndex).toBe(1);
    });

    test("CurrentStepGetterTest_ReturnNameOfActiveStep", () => {
      expect(component.currentStep).toBe("1");
    });

    test("FirstStepNameGetterTest_ReturnNameOfFirstStep", () => {
      expect(component.firstStepName).toBe("1");
    });

    test("CurrentStepNodeGetterTest_ReturnNameCurrentStep", () => {
      expect(component.currentStepNode.name).toBe(component.steps[0].name);
      expect(component.currentStepNode.isActive).toBe(
        component.steps[0].isActive
      );
    });
  });

  describe("Forward Navigation Tests", () => {
    test("TransitionToNext_FromAtFirstStep_IncrementOneStep", () => {
      component.transitionToNext();
      expect(component.currentStepIndex).toBe(2);
      expect(component.currentStep).toBe("2");
      expect(component.firstStepName).toBe("1");
      expect(component.currentStepNode.name).toBe(component.steps[1].name);
      expect(component.currentStepNode.isActive).toBe(
        component.steps[1].isActive
      );
    });
  });

  describe("Backward Navigation Tests", () => {
    test("TransitionToPrevious_FromAtFirstStep_NoChangeAtStart", () => {
      component.transitionToPrevious();
      expect(component.currentStepIndex).toBe(1);
      expect(component.currentStep).toBe("1");
      expect(component.firstStepName).toBe("1");
      expect(component.currentStepNode.name).toBe(component.steps[0].name);
      expect(component.currentStepNode.isActive).toBe(
        component.steps[0].isActive
      );
    });
  });
});
