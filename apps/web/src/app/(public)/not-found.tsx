import { ActionLink, PageHero } from "../public-shell/marketing";

export default function NotFound() {
  return (
    <PageHero
      actions={
        <ActionLink href="/" primary>
          Return home
        </ActionLink>
      }
      description="The address does not match a public PlayToday route."
      eyebrow="Page not found"
      marker="404"
      title="Nothing is published here."
    />
  );
}
