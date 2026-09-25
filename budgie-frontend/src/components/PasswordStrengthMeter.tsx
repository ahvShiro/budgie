import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnPtBrPackage from "@zxcvbn-ts/language-pt-br";

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnPtBrPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnPtBrPackage.translations,
};

const zxcvbn = new ZxcvbnFactory(options);

interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter = ({
  password = "",
}: PasswordStrengthMeterProps) => {
  const result = zxcvbn.check(password);

  const scoreColors = [
    "bg-destructive",
    "bg-orange-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  const activeColor = scoreColors[result.score];
  const filledBars = password.length === 0 ? 0 : result.score + 1 
  const feedback =
    password == ""
      ? "Digite a senha."
      : result.feedback.warning ||
        result.feedback.suggestions.join(" ") ||
        "Senha forte.";

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${index < filledBars ? activeColor : "bg-gray-500"}`}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{feedback}</p>
    </div>
  );
};
