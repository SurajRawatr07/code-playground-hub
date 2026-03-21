export const Hero = () => {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-8 pt-20 text-center animate-fade-up">
      <h1
        className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
        style={{ lineHeight: "1.1" }}
      >
        Code online with{" "}
        <span className="text-accent">OneIDE</span>.
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground" style={{ textWrap: "pretty" }}>
        Code. Run. Build. Anywhere. No setup required.
      </p>
    </section>
  );
};
