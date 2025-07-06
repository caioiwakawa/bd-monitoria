function FormBox(props: {
  placeholder: string;
  name: string;
  senha?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const secret = props.senha ? "password" : "text";

  return (
    <div className="relative w-92 h-20 mx-20 my-10 bg-white rounded-2xl">
      <input
        type={secret}
        placeholder={props.placeholder}
        name={props.name}
        className="absolute left-8 top-6 text-2xl"
        required
        onChange={props.onChange}
      />
    </div>
  );
}
export default FormBox;