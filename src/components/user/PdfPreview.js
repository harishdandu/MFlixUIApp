import React, { useState, useRef } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
import headings from '../../data/headings.json';
import '../../stylesheets/PdfPreview.css';
import '../../App.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreview = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const pdfWrapper = useRef(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleHeadingClick = (page) => {
        setPageNumber(page);
        if (pdfWrapper.current) {
            pdfWrapper.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="pdf-container">
            <div className="headings">
                <ul>
                    {headings.map((heading, index) => (
                        <li key={index} onClick={() => handleHeadingClick(heading.page)}>
                            {heading.title}
                        </li>
                    ))}
                </ul>
            </div>

            {/* <div className="pdf-view" ref={pdfWrapper}>
                <Document
                    file="https://arxiv.org/pdf/quant-ph/0410100.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error('PDF Load Error:', error)}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
            </div> */}
        </div>
    );
};

export default PdfPreview;
