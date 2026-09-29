import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export type ApplicantConfirmationProps = {
  referenceNumber: string;
  firstName: string;
  projectName: string;
  contactEmail: string;
};

export default function ApplicantConfirmation({
  referenceNumber,
  firstName,
  projectName,
  contactEmail,
}: ApplicantConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>We&apos;ve received your idea — reference {referenceNumber}</Preview>
      <Tailwind>
        <Body className="bg-slate-100 py-10 font-sans">
          <Container className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-sm">
            <Section className="bg-indigo-600 px-8 py-9 text-center">
              <Text className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
                Pitch2Product
              </Text>
              <Heading className="m-0 mt-2 text-2xl font-bold text-white">
                We&apos;ve got your idea, {firstName}!
              </Heading>
            </Section>

            <Section className="px-8 py-8">
              <Text className="m-0 mb-5 text-base text-slate-700">
                Thanks for submitting <strong className="text-slate-900">{projectName}</strong>. It&apos;s in front
                of our team now, and we&apos;re genuinely excited to take a look.
              </Text>

              <Section className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/70 px-5 py-4 text-center">
                <Text className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500">
                  Your reference number
                </Text>
                <Text className="m-0 mt-1 text-xl font-bold text-indigo-700">{referenceNumber}</Text>
              </Section>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-slate-600">
                <strong className="text-slate-900">What happens next:</strong> our team reviews every submission
                and typically gets back to you within <strong className="text-slate-900">5–7 business days</strong>.
                If your idea is selected, we&apos;ll reach out to set up a 1:1 discussion. Not every idea moves
                forward — but every one gets a real look.
              </Text>

              <Hr className="my-6 border-slate-200" />

              <Text className="m-0 text-sm text-slate-600">
                Have a question in the meantime? Just reply, or reach us directly at{" "}
                <a href={`mailto:${contactEmail}`} className="font-semibold text-indigo-600">
                  {contactEmail}
                </a>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
