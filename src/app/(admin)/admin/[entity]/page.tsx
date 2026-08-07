type Props = {
  params: Promise<{ entity: string }>;
};

export default async function AdminEntityPage({ params }: Props) {
  const { entity } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight capitalize">
        {entity}
      </h1>
      <p className="mt-2 text-neutral-600">Entity admin stub.</p>
    </div>
  );
}
