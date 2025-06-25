function FormBox(props: {placeholder: string, senha?: boolean}) {

    const secret = props.senha ? "password" : "text";

    return (
        <div className="relative w-92 h-20 mx-20 my-10 bg-white rounded-2xl">
            <input type={secret} placeholder={props.placeholder} className="absolute left-8 top-6 text-2xl"></input>
        </div>
    )
}

export default FormBox;