import { Form } from "@/components/form";

export const Page = () => {
  // Adicionando o return para renderizar o JSX
  return (
    <div className="m-10">
      <h1 className="text-white text-3xl font-bold">Processo de upload</h1>
      {/* Se o Form for um componente, você pode usá-lo aqui */}
      <Form />
    </div>
  );
};

export default Page;
