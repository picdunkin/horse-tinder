import type { GetMyMatchesUseCase } from "@/src/application/use-cases/dating/get-my-matches";
import { mapControllerError } from "../controller-error";
import {
  toConversationListItemViewModel,
  toMatchListItemViewModel,
} from "../view-models";

export class GetMyMatchesController {
  constructor(private readonly useCase: GetMyMatchesUseCase) {}

  async execute() {
    try {
      const matches = await this.useCase.execute();
      return {
        status: "success" as const,
        matches: matches.map(toMatchListItemViewModel),
        conversations: matches.map(toConversationListItemViewModel),
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
