declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      logging?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string;
    };
    jsPDF?: {
      unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc';
      format?: string | number[];
      orientation?: 'portrait' | 'landscape';
    };
    enableLinks?: boolean;
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement | string): Html2Pdf;
    to(type: 'blob' | 'pdf' | 'canvas' | 'img'): Promise<Blob | unknown>;
    outputPdf(type: 'blob'): Promise<Blob>;
    outputPdf(type: 'pdf'): Promise<unknown>;
    outputPdf(type: 'canvas'): Promise<HTMLCanvasElement>;
    outputPdf(type: 'img'): Promise<string>;
    save(filename?: string): Promise<void>;
    then(callback: (pdf: unknown) => void): Html2Pdf;
    catch(callback: (error: Error) => void): Html2Pdf;
  }

  function html2pdf(): Html2Pdf;
  export default html2pdf;
}
