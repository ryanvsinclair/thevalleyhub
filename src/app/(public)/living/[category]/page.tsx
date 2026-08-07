type Props = {
  params: Promise<{ category: string }>;
};

export default async function LivingPage({ params }: Props) {
  const { category } = await params;
  return (
    <div className="px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Living</h1>
      <p className="mt-2 text-neutral-500">{category}</p>
    </div>
  );
}
