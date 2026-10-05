import { Select } from "@/components/ui/select";

type Option = { id: string; name: string };

type SourceSelectProps = {
  accounts: Option[];
  cards: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function SourceSelect({ accounts, cards, value, onChange }: SourceSelectProps) {
  return (
    <Select name="source" value={value} onChange={(event) => onChange(event.target.value)}>
      <optgroup label="Cuentas">
        {accounts.map((option) => (
          <option key={option.id} value={`account:${option.id}`}>
            {option.name}
          </option>
        ))}
      </optgroup>
      {cards.length > 0 && (
        <optgroup label="Tarjetas">
          {cards.map((option) => (
            <option key={option.id} value={`card:${option.id}`}>
              {option.name}
            </option>
          ))}
        </optgroup>
      )}
    </Select>
  );
}
