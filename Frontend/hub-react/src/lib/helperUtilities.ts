export function allowNumericInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
}
