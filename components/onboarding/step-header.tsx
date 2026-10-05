type StepHeaderProps = {
  title: string;
  description: string;
};

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl sm:text-2xl">{title}</h2>
      <p className="text-sm text-muted sm:text-base">{description}</p>
    </div>
  );
}
