import { IStep } from "../interface";

export class State {
  private _steps: IStep[];
  private _activeStep: number;
  private _furthestStepIndex: number;

  constructor(data: any) {
    this._activeStep = data?.activeStep ?? 0;
    this._steps = data?.steps ?? [];
  }

  get steps() {
    return this._steps ?? [];
  }
  set steps(value: IStep[]) {
    this._steps = value;
  }

  get currentStep() {
    return this._steps[this.activeStep];
  }

  get activeStep() {
    return this._activeStep ?? 0;
  }
  set activeStep(value: number) {
    this._activeStep = value;
  }

  get furthestStepIndex() {
    return this._furthestStepIndex ?? 0;
  }
  set furthestStepIndex(value: number) {
    this._furthestStepIndex = value;
  }

  getCompleted(index: number) {
    return this._steps[index]?.completed ?? false;
  }

  setCompleted(index: number, value: boolean) {
    const step = this._steps[index];
    if (step) step.completed = value;
  }

  checkStep() {
    return this.activeStep < this._steps.length && this.getCompleted(this.activeStep);
  }

  checkDone() {
    return this.steps.every(step => step.completed);
  }
}
