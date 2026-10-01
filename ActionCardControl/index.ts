import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { ActionCard, IActionCardProps } from "./ActionCard";

type CanvasEventName = "OnFlowTrigger" | "OnUpdateRequest";

export class ActionCardControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private root: Root | null = null;
    private context: ComponentFramework.Context<IInputs> | null = null;
    private notifyOutputChanged: (() => void) | null = null;
    private selectedStatus = "";

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.root = createRoot(container);
    }

    private fireEvent(name: CanvasEventName): void {
        const events = this.context?.events as unknown as
            Record<string, (() => void) | undefined> | undefined;
        events?.[name]?.();
    }

    private readonly handleTriggerFlow = (): void => this.fireEvent("OnFlowTrigger");
    private readonly handleRequestUpdate = (): void => this.fireEvent("OnUpdateRequest");

    private readonly handleStatusChange = (value: string): void => {
        this.selectedStatus = value;
        this.notifyOutputChanged?.();
    };

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
        if (!this.root) return;

        const props: IActionCardProps = {
            taskName: context.parameters.taskName.raw ?? "",
            status: context.parameters.statusValue.raw ?? "",
            statusOptions: (context.parameters.statusOptions.raw ?? "")
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== ""),
            onStatusChange: this.handleStatusChange,
            onTriggerFlow: this.handleTriggerFlow,
            onRequestUpdate: this.handleRequestUpdate
        };

        this.root.render(React.createElement(ActionCard, props));
    }

    public getOutputs(): IOutputs {
        return {
            selectedStatus: this.selectedStatus
        };
    }

    public destroy(): void {
        this.root?.unmount();
        this.root = null;
    }
}