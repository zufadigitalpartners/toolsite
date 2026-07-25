import ToolShell from "@/components/ToolShell";
import PasswordGenerator from "@/components/tools/PasswordGenerator";

export const metadata = {
  title: "Password Generator — Create Strong Random Passwords",
  description:
    "Free strong password generator. Create secure random passwords with letters, numbers and symbols — generated in your browser, never stored.",
};

export default function Page() {
  return (
    <ToolShell slug="password-generator">
      <PasswordGenerator />
    </ToolShell>
  );
}
