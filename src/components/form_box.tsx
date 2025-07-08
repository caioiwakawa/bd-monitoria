// O tipo 'HTMLInputTypeAttribute' vem do React e inclui todos os tipos de input válidos
import { HTMLInputTypeAttribute } from "react";

function FormBox(props: {
  placeholder: string;
  name: string;
  // Permite qualquer tipo de input HTML válido (text, password, email, number, date, etc.)
  type?: HTMLInputTypeAttribute;
  // Permite que o campo seja opcional. Por defeito, é obrigatório.
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // Define o tipo padrão como 'text' se não for especificado
  const inputType = props.type || "text";
  // Define 'required' como verdadeiro por defeito, a menos que seja explicitamente definido como falso
  const isRequired = props.required !== false;

  return (
    <div className="relative w-92 h-20 mx-20 my-10 bg-white rounded-2xl">
      <input
        type={inputType}
        placeholder={props.placeholder}
        name={props.name}
        className="absolute left-8 top-6 text-2xl bg-transparent w-[calc(100%-4rem)] outline-none"
        required={isRequired}
        onChange={props.onChange}
      />
    </div>
  );
}
export default FormBox;
