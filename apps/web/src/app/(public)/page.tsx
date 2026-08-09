import type { Metadata } from "next";
import {
  EngineeringFoundation,
  FeatureLaboratory,
  HomeHero,
  Transparency,
  TrustPlansFaq,
  ValueAndCoverage,
  Workflow,
} from "../../components/public/home";
import { metadataFor } from "../public-shell/routes";
export const metadata: Metadata = metadataFor("home");
export default function Home() {
  return (
    <>
      <HomeHero />
      <EngineeringFoundation />
      <ValueAndCoverage />
      <FeatureLaboratory />
      <Workflow />
      <Transparency />
      <TrustPlansFaq />
    </>
  );
}
