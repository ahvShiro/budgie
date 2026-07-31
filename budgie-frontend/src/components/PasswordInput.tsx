import { EyeIcon, EyeOffIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import React, { useRef, useState } from "react";

interface PasswordInputProps extends React.HTMLAttributes<HTMLInputElement> {
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
}

export const PasswordInput = ({
  id,
  placeholder,
  className,
  onChange,
  name,
  value,
}: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    const input = inputRef.current;

    if (!input) return;

    const cursorStart = input.selectionStart;
    const cursorEnd = input.selectionEnd;

    setIsPasswordVisible((prev) => !prev);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(cursorStart, cursorEnd);
    }, 0);
  };

  return (
    <InputGroup>
      <InputGroupInput
        className={className}
        ref={inputRef}
        type={isPasswordVisible ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      <InputGroupAddon align="inline-end">
        <EyeIcon
          aria-hidden={isPasswordVisible}
          className={isPasswordVisible ? "hidden" : ""}
          onClick={() => togglePasswordVisibility()}
        />
        <EyeOffIcon
          aria-hidden={!isPasswordVisible}
          className={!isPasswordVisible ? "hidden" : ""}
          onClick={() => togglePasswordVisibility()}
        />
      </InputGroupAddon>
    </InputGroup>
  );
};
