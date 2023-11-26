import { useState } from "react";


export default function QuoteBox() {
    const [quote, setQuote] = useState("Dedication To The Groove");
    const [quoteFrom, setQuoteFrom] = useState("");

    return (
        <div className="layer3">
        <div className="layer3Text">
          <div className="layer3Quote">{quote}</div>
          <div className="layer3QuoteFrom">{quoteFrom}</div>
        </div>
      </div>
    )
}