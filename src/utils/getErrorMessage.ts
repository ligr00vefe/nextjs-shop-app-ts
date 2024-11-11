function getErrorMessage(error: unknown) {
    // error가 객체이면 message를 반환하고
    if (error instanceof Error) return error.message;

    // error가 객체가 아니면 String으로 변환해서 반환.
    return String(error);
}
