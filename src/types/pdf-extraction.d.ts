declare module 'pdf-extraction' {
    interface PDFData {
        text: string;
    }
    function extract(buffer: Buffer, options?: any): Promise<PDFData>;
    export = extract;
}