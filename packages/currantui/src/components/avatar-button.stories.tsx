import { Gear, Question, SignOut } from "@phosphor-icons/react"
import { userEvent, within } from "storybook/test"

import {
  AvatarButton,
  AvatarButtonItem,
  AvatarButtonLabel,
  AvatarButtonMenu,
  AvatarButtonSeparator,
  AvatarButtonTrigger,
} from "@nhic/currantui/components/avatar-button"
import type { Meta, StoryObj } from "@storybook/react-vite"

// Small inline placeholder avatar so the suite makes no external HTTP call
const AVATAR_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%236366f1'/%3E%3C/svg%3E"

const meta = {
  title: "Components/AvatarButton",
  component: AvatarButton,
  args: {
    children: null,
  },
} satisfies Meta<typeof AvatarButton>

export default meta
type Story = StoryObj<typeof meta>

/*
 * `icon` takes a component reference (React.ElementType), not an element —
 * Storybook's dynamic source serializer (used for any `render:` story) can't
 * print a forwardRef object and emits raw `$$typeof` internals instead, so
 * every story below carries an explicit copyable docs.source.code snippet.
 */
const onlySettingsSource = `<AvatarButton>
  <AvatarButtonTrigger name="Aline Umutoni" />
  <AvatarButtonMenu>
    <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
  </AvatarButtonMenu>
</AvatarButton>`

export const OnlySettings: Story = {
  render: () => (
    <AvatarButton>
      <AvatarButtonTrigger name="Aline Umutoni" />
      <AvatarButtonMenu>
        <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
      </AvatarButtonMenu>
    </AvatarButton>
  ),
  parameters: {
    docs: { source: { code: onlySettingsSource, language: "tsx" } },
  },
}

const fullMenuSource = `<AvatarButton>
  <AvatarButtonTrigger name="Aline Umutoni" />
  <AvatarButtonMenu>
    <AvatarButtonLabel name="Aline Umutoni" email="aline@nhic.gov.rw" />
    <AvatarButtonSeparator />
    <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
    <AvatarButtonItem icon={Question}>Help</AvatarButtonItem>
    <AvatarButtonSeparator />
    <AvatarButtonItem icon={SignOut} destructive>
      Sign out
    </AvatarButtonItem>
  </AvatarButtonMenu>
</AvatarButton>`

export const FullMenu: Story = {
  render: () => (
    <AvatarButton>
      <AvatarButtonTrigger name="Aline Umutoni" />
      <AvatarButtonMenu>
        <AvatarButtonLabel name="Aline Umutoni" email="aline@nhic.gov.rw" />
        <AvatarButtonSeparator />
        <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
        <AvatarButtonItem icon={Question}>Help</AvatarButtonItem>
        <AvatarButtonSeparator />
        <AvatarButtonItem icon={SignOut} destructive>
          Sign out
        </AvatarButtonItem>
      </AvatarButtonMenu>
    </AvatarButton>
  ),
  parameters: {
    docs: { source: { code: fullMenuSource, language: "tsx" } },
  },
}

export const Open: Story = {
  render: FullMenu.render,
  parameters: {
    docs: { source: { code: fullMenuSource, language: "tsx" } },
    a11y: {
      config: {
        // Radix DropdownMenu marks the page background aria-hidden while
        // open, which axe flags because the focusable trigger sits inside
        // it (library-level interplay, not story authoring)
        rules: [{ id: "aria-hidden-focus", enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "User menu" }))
    // Menu renders in a portal outside the canvas root
    await within(document.body).findByRole("menuitem", { name: /Sign out/ })
  },
}

const imageTriggerSource = `<AvatarButton>
  <AvatarButtonTrigger name="Aline Umutoni" src={AVATAR_DATA_URI} />
  <AvatarButtonMenu>
    <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
  </AvatarButtonMenu>
</AvatarButton>`

export const ImageTrigger: Story = {
  render: () => (
    <AvatarButton>
      <AvatarButtonTrigger name="Aline Umutoni" src={AVATAR_DATA_URI} />
      <AvatarButtonMenu>
        <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
      </AvatarButtonMenu>
    </AvatarButton>
  ),
  parameters: {
    docs: { source: { code: imageTriggerSource, language: "tsx" } },
  },
}

const iconOnlyTriggerSource = `<AvatarButton>
  <AvatarButtonTrigger />
  <AvatarButtonMenu>
    <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
  </AvatarButtonMenu>
</AvatarButton>`

export const IconOnlyTrigger: Story = {
  render: () => (
    <AvatarButton>
      <AvatarButtonTrigger />
      <AvatarButtonMenu>
        <AvatarButtonItem icon={Gear}>Settings</AvatarButtonItem>
      </AvatarButtonMenu>
    </AvatarButton>
  ),
  parameters: {
    docs: { source: { code: iconOnlyTriggerSource, language: "tsx" } },
  },
}
