import * as React from "react";
import {
  FluentProvider,
  webLightTheme,
  Card,
  CardHeader,
  Button,
  Badge,
  Dropdown,
  Option,
  Text
} from "@fluentui/react-components";
import { Play24Regular, DatabaseArrowUpRegular } from "@fluentui/react-icons";

export interface IActionCardProps {
  taskName: string;
  status: string;
  statusOptions: string[];
  onStatusChange: (value: string) => void;
  onTriggerFlow: () => void;
  onRequestUpdate: () => void;
}

export const ActionCard: React.FC<IActionCardProps> = ({
  taskName,
  status,
  statusOptions,
  onStatusChange,
  onTriggerFlow,
  onRequestUpdate
}) => {
  const [selected, setSelected] = React.useState("");

  const hasRecord = taskName !== "";
  const statusLower = status.toLowerCase();
  const badgeColor =
    statusLower.includes("approved") ? "success" :
      statusLower.includes("rejected") ? "danger" :
        "informative";

  return (
    <FluentProvider theme={webLightTheme}>
      <Card style={{ width: "100%", boxSizing: "border-box", padding: "16px", borderRadius: "12px" }}>
        <CardHeader
          header={
            <Text weight="semibold" size={400}>
              {hasRecord ? taskName : "Оберіть завдання"}
            </Text>
          }
          description={status ? <Badge color={badgeColor}>{status}</Badge> : undefined}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
          <Button
            appearance="primary"
            icon={<Play24Regular />}
            disabled={!hasRecord}
            onClick={onTriggerFlow}
          >
            Запустити Power Automate
          </Button>

          <Dropdown
            placeholder="Оберіть новий статус"
            disabled={!hasRecord}
            value={selected}
            selectedOptions={selected ? [selected] : []}
            onOptionSelect={(_, data) => {
              const value = data.optionValue ?? "";
              setSelected(value);
              onStatusChange(value);
            }}
          >
            {statusOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>

          <Button
            appearance="secondary"
            icon={<DatabaseArrowUpRegular />}
            disabled={!hasRecord || selected === ""}
            onClick={onRequestUpdate}
          >
            Оновити в Dataverse
          </Button>
        </div>
      </Card>
    </FluentProvider>
  );
};