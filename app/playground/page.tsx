import { Playground } from "@/components/playground";
import { Section } from "@/components/section";

export default function PlaygroundPage() {
  return (
    <Section
      eyebrow="Coding playground"
      title="Split-screen editor with live output"
      copy="Run HTML/CSS/JS, simulated Python analysis, and SQL result previews with console feedback, reset controls and theme switching."
    >
      <Playground />
    </Section>
  );
}
