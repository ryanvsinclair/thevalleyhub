type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ClusterPage({ params }: Props) {
  const { slug } = await params;
  return <Stub title="Cluster" slug={slug} />;
}

function Stub({ title, slug }: { title: string; slug: string }) {
  return (
    <div className="px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-neutral-500">{slug}</p>
    </div>
  );
}
