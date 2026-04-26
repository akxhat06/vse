type AuthHeadingProps = {
  emphasis: string;
  tail: string;
};

export function AuthHeading({ emphasis, tail }: AuthHeadingProps) {
  return (
    <h1 className="mb-9 text-left text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
      <span className="relative inline-block">
        {emphasis}
        <span
          className="absolute -bottom-1 left-0 h-1.5 w-[50%] rounded-sm bg-teal-600"
          aria-hidden
        />
      </span>
      {tail}
    </h1>
  );
}
