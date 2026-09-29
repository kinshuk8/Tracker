import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export type AdminNotificationProps = {
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  applicantType: string;
  city: string;
  projectName: string;
  ideaDescription: string;
  currentStage: string;
  timeline: string;
  budget: string;
  files: { name: string; url: string; description: string }[];
  consoleUrl: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Text className="m-0 mb-3 text-sm leading-relaxed text-slate-700">
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-indigo-600">
        {label}
      </span>
      <br />
      {value || "—"}
    </Text>
  );
}

export default function AdminNotification({
  referenceNumber,
  fullName,
  email,
  phone,
  applicantType,
  city,
  projectName,
  ideaDescription,
  currentStage,
  timeline,
  budget,
  files,
  consoleUrl,
}: AdminNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New Pitch2Product submission: {projectName} from {fullName}
      </Preview>
      <Tailwind>
        <Body className="bg-slate-100 py-10 font-sans">
          <Container className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-sm">
            <Section className="bg-indigo-600 px-8 py-7">
              <Text className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
                Pitch2Product · New submission
              </Text>
              <Heading className="m-0 mt-2 text-2xl font-bold text-white">{projectName}</Heading>
            </Section>

            <Section className="px-8 py-7">
              <Text className="m-0 mb-5 text-sm text-slate-600">
                <strong className="text-slate-900">{fullName}</strong> ({applicantType}) just submitted a new idea.
                Reference <strong className="text-indigo-700">{referenceNumber}</strong>.
              </Text>

              <Row label="Idea" value={ideaDescription} />
              <Row label="Current stage" value={currentStage} />
              <Row label="Timeline / Budget" value={`${timeline} · ${budget}`} />
              <Text className="m-0 mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-indigo-600">
                Supporting files
              </Text>
              {files.length === 0 ? (
                <Text className="m-0 mb-3 text-sm text-slate-700">None attached</Text>
              ) : (
                files.map((f) => (
                  <Text key={f.name} className="m-0 mb-2 text-sm leading-relaxed text-slate-700">
                    <Link href={f.url} className="font-semibold text-indigo-600 no-underline">
                      {f.name}
                    </Link>
                    {f.description ? <span className="text-slate-500"> — {f.description}</span> : null}
                  </Text>
                ))
              )}
              <Text className="m-0 mb-3 text-xs text-slate-400">
                File links expire in 7 days; the full submission stays in the console.
              </Text>

              <Hr className="my-5 border-slate-200" />

              <Row label="Contact" value={`${email} · ${phone} · ${city}`} />

              <Section className="mt-6 text-center">
                <Link
                  href={consoleUrl}
                  className="inline-block rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white no-underline"
                >
                  View full submission
                </Link>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
