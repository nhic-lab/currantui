import { ThemeToggle } from "@nhic/currantui/components/theme-toggle"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    docs: {
      description: {
        component:
          "Clicking the toggle changes the real `dark` class on the preview document, the same class the Storybook theme toolbar manages.",
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

// Theme pinned so the toolbar and the component never fight over the class;
// no play interaction to keep browser tests free of localStorage bleed
export const Default: Story = {
  globals: { theme: "dark" },
}
