"use client";                                                                                                                                                                           
                  
  import { useActionState, useMemo, useState } from "react";                                                                                                                              
  import { FormDatePicker } from "@/app/(main)/invoice/_components/FormDatePicker";
  import { FormSelectField } from "@/app/(main)/invoice/_components/FormSelectField";                                                                                                     
  import {                                                                                                                                                                                
    type ActionResult,                                                                                                                                                                    
    saveInvoice,                                                                                                                                                                          
  } from "@/app/(main)/invoice/store-actions";
  import {                                                                                                                                                                                
    Dialog,
    DialogContent,                                                                                                                                                                        
    DialogDescription,
    DialogHeader,
    DialogTitle,                                                                                                                                                                          
    DialogTrigger,
  } from "@/components/ui/dialog";                                                                                                                                                        
  import { computeInvoiceAmounts } from "@/lib/store/invoice-math";
  import type { Company, Retailer } from "@/lib/store/types";                                                                                                                             
                                                                                                                                                                                          
  const AMBER = "rgb(245,158,11)";                                                                                                                                                        
  const MONO = "var(--font-mono)";                                                                                                                                                        
  const DISPLAY = "var(--font-display)";                                                                                                                                                  
  
  type Props = {                                                                                                                                                                          
    companies: Company[];
    retailers: Retailer[];                                                                                                                                                                
    redirectTo: string;
  };                                                                                                                                                                                      
                  
  const inr = new Intl.NumberFormat("en-IN", {                                                                                                                                            
    style: "currency",
    currency: "INR",                                                                                                                                                                      
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });                                                                                                                                                                                     
  
  /* ── shared input styles ── */                                                                                                                                                         
  const underlineBase: React.CSSProperties = {
    borderBottom: "1px solid rgba(255,255,255,0.12)",                                                                                                                                     
  };                                                                                                                                                                                      
  
  const inputClass =                                                                                                                                                                      
    "peer w-full bg-transparent pb-2.5 pt-1 text-base " +
    "text-white outline-none placeholder:text-white/20 sm:text-sm";                                                                                                                       
                                                                                                                                                                                          
  const sweepClass =                                                                                                                                                                      
    "pointer-events-none absolute inset-x-0 -bottom-px h-px " +                                                                                                                           
    "origin-left scale-x-0 transition-transform duration-500 " +                                                                                                                          
    "ease-out peer-focus:scale-x-100";                                                                                                                                                    
                                                                                                                                                                                          
  const sweepStyle: React.CSSProperties = {                                                                                                                                               
    background: `linear-gradient(90deg, ${AMBER}, rgba(245,158,11,0))`,
  };                                                                                                                                                                                      
                  
  export function AddInvoiceDialog({                                                                                                                                                      
    companies,    
    retailers,
    redirectTo,
  }: Props) {
    const [open, setOpen] = useState(false);                                                                                                                                              
    const [companyId, setCompanyId] = useState("");
    const [retailerId, setRetailerId] = useState("");                                                                                                                                     
    const [baseAmount, setBaseAmount] = useState("");                                                                                                                                     
    const [gstPercent, setGstPercent] = useState("0");
    const [cdPercent, setCdPercent] = useState("0");                                                                                                                                      
                                                                                                                                                                                          
    const filteredRetailers = useMemo(
      () => retailers.filter((r) => r.companyId === companyId),                                                                                                                           
      [retailers, companyId],                                                                                                                                                             
    );
                                                                                                                                                                                          
    const calc = useMemo(() => {
      const base = Number.parseFloat(baseAmount) || 0;
      return computeInvoiceAmounts({                                                                                                                                                      
        baseAmount: base,
        gstPercent: Number.parseFloat(gstPercent) || 0,                                                                                                                                   
        cashDiscountPercent: Number.parseFloat(cdPercent) || 0,                                                                                                                           
        cashDiscountAmountInput: null,
        commissionPercent: 0,                                                                                                                                                             
      });         
    }, [baseAmount, gstPercent, cdPercent]);                                                                                                                                              
                                                                                                                                                                                          
    const [state, formAction, pending] = useActionState<
      ActionResult | undefined,                                                                                                                                                           
      FormData    
    >(saveInvoice, undefined);
                                                                                                                                                                                          
    const canCreate = companies.length > 0 && retailers.length > 0;
                                                                                                                                                                                          
    const handleOpenChange = (next: boolean) => {                                                                                                                                         
      setOpen(next);
      if (!next) {                                                                                                                                                                        
        setCompanyId("");
        setRetailerId("");
        setBaseAmount("");
        setGstPercent("0");                                                                                                                                                               
        setCdPercent("0");
      }                                                                                                                                                                                   
    };            

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {/* ── FAB trigger ── */}
        <DialogTrigger asChild>                                                                                                                                                           
          <button
            type="button"                                                                                                                                                                 
            disabled={!canCreate}
            className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 transition active:scale-[0.97] disabled:opacity-40 lg:bottom-6 lg:right-6"
            style={{                                                                                                                                                                      
              background: AMBER,
              color: "#0a0a0d",                                                                                                                                                           
              fontFamily: MONO,
              boxShadow:
                "0 14px 36px -12px rgba(245,158,11,0.55), inset 0 1px 0 rgba(255,255,255,0.3)",                                                                                           
            }}
            aria-label="Add invoice"                                                                                                                                                      
          >                                                                                                                                                                               
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              New invoice                                                                                                                                                                 
            </span>
            <span className="text-[12px]">→</span>
          </button>                                                                                                                                                                       
        </DialogTrigger>
                                                                                                                                                                                          
        {/* ── Dialog ── */}
        <DialogContent
          className="max-w-2xl border-0 p-0 sm:rounded-none"
          style={{                                                                                                                                                                        
            background: "#0a0a0d",
            border: "1px solid rgba(255,255,255,0.1)",                                                                                                                                    
            boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
          }}                                                                                                                                                                              
        >         
          {/* Top amber hairline */}                                                                                                                                                      
          <div                                                                                                                                                                            
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"                                                                                                                                     
            style={{
              background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)`,                                                                                                   
            }}
          />                                                                                                                                                                              
                  
          <DialogHeader className="space-y-1.5 px-5 pt-6">                                                                                                                                
            <p
              className="text-[10px] uppercase tracking-[0.3em]"                                                                                                                          
              style={{ fontFamily: MONO, color: AMBER }}                                                                                                                                  
            >
              New entry                                                                                                                                                                   
            </p>  
            <DialogTitle                                                                                                                                                                  
              className="text-[24px] leading-none text-white"
              style={{                                                                                                                                                                    
                fontFamily: DISPLAY,
                fontWeight: 400,                                                                                                                                                          
                letterSpacing: "-0.01em",
              }}
            >
              Add invoice                                                                                                                                                                 
            </DialogTitle>
            <DialogDescription                                                                                                                                                            
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{                                                                                                                                                                    
                fontFamily: MONO,
                color: "rgba(255,255,255,0.4)",                                                                                                                                           
              }}  
            >
              Bill total computes from base · gst · discount.
            </DialogDescription>                                                                                                                                                          
          </DialogHeader>
                                                                                                                                                                                          
          <div className="max-h-[70vh] overflow-y-auto px-5 pb-5">
            {!canCreate ? (
              <div                                                                                                                                                                        
                className="mt-4 flex items-start gap-3 px-4 py-3"
                style={{                                                                                                                                                                  
                  background: "rgba(248,113,113,0.06)",                                                                                                                                   
                  borderLeft: "2px solid rgba(248,113,113,0.6)",
                  color: "rgba(252,165,165,0.95)",                                                                                                                                        
                  fontFamily: MONO,                                                                                                                                                       
                }}                                                                                                                                                                        
              >                                                                                                                                                                           
                <span className="mt-0.5 shrink-0 font-bold">!</span>
                <span className="text-[12px] uppercase tracking-wider">                                                                                                                   
                  Add a company and retailer first.
                </span>                                                                                                                                                                   
              </div>
            ) : (                                                                                                                                                                         
              <form action={formAction} className="space-y-6 pt-2">
                <input type="hidden" name="id" value="" />                                                                                                                                
                <input
                  type="hidden"                                                                                                                                                           
                  name="_redirect"
                  value={redirectTo}                                                                                                                                                      
                />
                <input
                  type="hidden"
                  name="commissionPercent"
                  value="0"                                                                                                                                                               
                />
                <input                                                                                                                                                                    
                  type="hidden"
                  name="cashDiscountAmountInput"
                  value=""                                                                                                                                                                
                />
                                                                                                                                                                                          
                {state?.ok === false && (
                  <div
                    className="flex items-start gap-3 px-4 py-3 text-[12px]"
                    style={{                                                                                                                                                              
                      background: "rgba(248,113,113,0.06)",
                      borderLeft: "2px solid rgba(248,113,113,0.6)",                                                                                                                      
                      color: "rgba(252,165,165,0.95)",
                      fontFamily: MONO,                                                                                                                                                   
                    }}                                                                                                                                                                    
                  >
                    <span className="mt-0.5 shrink-0 font-bold">!</span>                                                                                                                  
                    <span className="uppercase tracking-wider">
                      {state.error}
                    </span>                                                                                                                                                               
                  </div>
                )}                                                                                                                                                                        
                  
                {/* ── 01 Parties ── */}                                                                                                                                                  
                <SectionHeader index="01" title="Parties" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">                                                                                                                   
                  <FieldShell label="Company" required index="1.1">                                                                                                                       
                    <FormSelectField                                                                                                                                                      
                      name="companyId"                                                                                                                                                    
                      label=""                                                                                                                                                            
                      placeholder="Select company"
                      value={companyId}                                                                                                                                                   
                      onValueChange={(v) => {
                        setCompanyId(v);                                                                                                                                                  
                        setRetailerId("");
                      }}                                                                                                                                                                  
                      options={companies.map((c) => ({
                        value: c.id,                                                                                                                                                      
                        label: c.name,
                      }))}
                    />                                                                                                                                                                    
                  </FieldShell>
                  <FieldShell label="Retailer" required index="1.2">                                                                                                                      
                    <FormSelectField
                      name="retailerId"
                      label=""
                      placeholder={
                        !companyId                                                                                                                                                        
                          ? "Select company first"
                          : filteredRetailers.length === 0                                                                                                                                
                            ? "No retailers"
                            : "Select retailer"                                                                                                                                           
                      }
                      value={retailerId}                                                                                                                                                  
                      onValueChange={setRetailerId}
                      options={filteredRetailers.map((r) => ({
                        value: r.id,                                                                                                                                                      
                        label: r.name,
                      }))}                                                                                                                                                                
                      disabled={
                        !companyId || filteredRetailers.length === 0
                      }
                    />                                                                                                                                                                    
                  </FieldShell>
                </div>                                                                                                                                                                    
                  
                {/* ── 02 Invoice ── */}
                <SectionHeader index="02" title="Invoice" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <FieldShell                                                                                                                                                             
                    label="Invoice date"
                    required                                                                                                                                                              
                    index="2.1"
                  >                                                                                                                                                                       
                    <FormDatePicker
                      name="invoiceDate"                                                                                                                                                  
                      label=""
                    />
                  </FieldShell>
                  <FieldShell label="Invoice no." required index="2.2">
                    <UnderlineInput                                                                                                                                                       
                      name="invoiceNo"
                      required                                                                                                                                                            
                      placeholder="e.g. INV-1042"
                    />                                                                                                                                                                    
                  </FieldShell>
                  <FieldShell label="Quantity" required index="2.3">                                                                                                                      
                    <UnderlineInput
                      name="quantity"                                                                                                                                                     
                      type="number"
                      min={1}
                      step={1}                                                                                                                                                            
                      required
                      placeholder="0"                                                                                                                                                     
                    />
                  </FieldShell>
                </div>

                {/* ── 03 Pricing ── */}
                <SectionHeader index="03" title="Pricing" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">                                                                                                                   
                  <FieldShell
                    label="Base amount"                                                                                                                                                   
                    required
                    index="3.1"                                                                                                                                                           
                  >
                    <UnderlineInput
                      name="baseAmount"
                      type="number"
                      min={0}
                      step="0.01"                                                                                                                                                         
                      required
                      value={baseAmount}                                                                                                                                                  
                      onChange={(e) => setBaseAmount(e.target.value)}
                      placeholder="0.00"
                    />                                                                                                                                                                    
                  </FieldShell>
                  <FieldShell label="GST (%)" index="3.2">                                                                                                                                
                    <UnderlineInput
                      name="gstPercent"
                      type="number"                                                                                                                                                       
                      min={0}
                      step="0.01"                                                                                                                                                         
                      value={gstPercent}
                      onChange={(e) => setGstPercent(e.target.value)}
                    />                                                                                                                                                                    
                  </FieldShell>
                  <FieldShell label="Cash disc. (%)" index="3.3">                                                                                                                         
                    <UnderlineInput
                      name="cashDiscountPercent"                                                                                                                                          
                      type="number"
                      min={0}                                                                                                                                                             
                      step="0.01"
                      value={cdPercent}
                      onChange={(e) => setCdPercent(e.target.value)}
                    />                                                                                                                                                                    
                  </FieldShell>
                </div>                                                                                                                                                                    
                  
                {/* ── 04 Computed ── */}
                <SectionHeader index="04" title="Computed" />
                <div                                                                                                                                                                      
                  className="overflow-hidden"
                  style={{                                                                                                                                                                
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}                                                                                                                                                                      
                >
                  <ReadRow                                                                                                                                                                
                    label="Cash discount"
                    value={inr.format(calc.cashDiscountApplied)}
                  />                                                                                                                                                                      
                  <ReadRow
                    label="Taxable (base − cd)"                                                                                                                                           
                    value={inr.format(calc.taxableAmount)}                                                                                                                                
                  />
                  <ReadRow                                                                                                                                                                
                    label="GST amount"                                                                                                                                                    
                    value={inr.format(calc.gstAmount)}
                  />                                                                                                                                                                      
                  <ReadRow
                    label="Invoice total"
                    value={inr.format(calc.invoiceAmount)}
                    emphasised                                                                                                                                                            
                    isLast
                  />                                                                                                                                                                      
                </div>
                                                                                                                                                                                          
                {/* ── Actions ── */}
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">                                                                                             
                  <button                                                                                                                                                                 
                    type="button"
                    onClick={() => handleOpenChange(false)}                                                                                                                               
                    className="px-5 py-3 text-[10px] uppercase tracking-[0.25em] transition active:opacity-70"                                                                            
                    style={{                                                                                                                                                              
                      fontFamily: MONO,                                                                                                                                                   
                      color: "rgba(255,255,255,0.6)",                                                                                                                                     
                      border: "1px solid rgba(255,255,255,0.1)",                                                                                                                          
                    }}
                  >                                                                                                                                                                       
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}                                                                                                                                                    
                    className="group relative flex items-center justify-between gap-3 overflow-hidden px-5 py-3 transition active:scale-[0.99] disabled:opacity-50"
                    style={{                                                                                                                                                              
                      background: AMBER,
                      color: "#0a0a0d",                                                                                                                                                   
                      boxShadow:
                        "0 14px 36px -12px rgba(245,158,11,0.55), inset 0 1px 0 rgba(255,255,255,0.3)",                                                                                   
                    }}                                                                                                                                                                    
                  >
                    <span                                                                                                                                                                 
                      className="text-[10px] font-bold uppercase tracking-[0.28em]"
                      style={{ fontFamily: MONO }}                                                                                                                                        
                    >
                      {pending ? "Saving" : "Save invoice"}                                                                                                                               
                    </span>
                    <span className="text-base">                                                                                                                                          
                      {pending ? "•••" : "→"}
                    </span>                                                                                                                                                               
                  </button>                                                                                                                                                               
                </div>
              </form>                                                                                                                                                                     
            )}    
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  /* ── Section header ── */                                                                                                                                                              
  function SectionHeader({
    index,                                                                                                                                                                                
    title,        
  }: {
    index: string;
    title: string;
  }) {
    return (
      <div className="flex items-center gap-3 pt-1">
        <span                                                                                                                                                                             
          className="text-[10px] tabular-nums"
          style={{ fontFamily: MONO, color: AMBER }}                                                                                                                                      
        >         
          {index}                                                                                                                                                                         
        </span>   
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{                                                                                                                                                                        
            fontFamily: MONO,
            color: "rgba(255,255,255,0.6)",                                                                                                                                               
          }}      
        >
          {title}
        </span>
        <div                                                                                                                                                                              
          className="h-px flex-1"
          style={{ background: "rgba(255,255,255,0.08)" }}                                                                                                                                
        />                                                                                                                                                                                
      </div>
    );                                                                                                                                                                                    
  }               

  /* ── Field label wrapper ── */
  function FieldShell({
    label,
    required,
    index,
    children,                                                                                                                                                                             
  }: {
    label: string;                                                                                                                                                                        
    required?: boolean;
    index?: string;
    children: React.ReactNode;
  }) {
    return (
      <div>                                                                                                                                                                               
        <div className="mb-1.5 flex items-baseline justify-between">
          <span                                                                                                                                                                           
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{                                                                                                                                                                      
              fontFamily: MONO,
              color: "rgba(255,255,255,0.5)",
            }}                                                                                                                                                                            
          >
            {label}                                                                                                                                                                       
            {required && (
              <span className="ml-1" style={{ color: AMBER }}>
                *                                                                                                                                                                         
              </span>
            )}                                                                                                                                                                            
          </span> 
          {index && (
            <span
              className="text-[9px] tabular-nums"
              style={{
                fontFamily: MONO,                                                                                                                                                         
                color: "rgba(255,255,255,0.22)",
              }}                                                                                                                                                                          
            >     
              {index}
            </span>
          )}
        </div>
        {children}
      </div>                                                                                                                                                                              
    );
  }                                                                                                                                                                                       
                  
  /* ── Underline input ── */
  function UnderlineInput({
    className,
    style,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) {                                                                                                                                       
    return (
      <div className="relative">                                                                                                                                                          
        <input    
          className={`${inputClass} ${className ?? ""}`}                                                                                                                                  
          style={{ ...underlineBase, ...style }}
          {...props}                                                                                                                                                                      
        />        
        <span aria-hidden className={sweepClass} style={sweepStyle} />                                                                                                                    
      </div>                                                                                                                                                                              
    );
  }                                                                                                                                                                                       
                  
  /* ── Read-only computed row ── */
  function ReadRow({
    label,
    value,
    emphasised,
    isLast,                                                                                                                                                                               
  }: {
    label: string;                                                                                                                                                                        
    value: string;
    emphasised?: boolean;
    isLast?: boolean;
  }) {
    return (
      <div
        className="flex items-baseline justify-between px-3 py-2.5"                                                                                                                       
        style={{
          borderBottom: isLast                                                                                                                                                            
            ? "none"
            : "1px solid rgba(255,255,255,0.06)",
          background: emphasised ? "rgba(245,158,11,0.06)" : "transparent",                                                                                                               
        }}                                                                                                                                                                                
      >                                                                                                                                                                                   
        <span                                                                                                                                                                             
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{
            fontFamily: MONO,
            color: emphasised
              ? AMBER                                                                                                                                                                     
              : "rgba(255,255,255,0.45)",
            fontWeight: emphasised ? 700 : 400,                                                                                                                                           
          }}                                                                                                                                                                              
        >
          {label}                                                                                                                                                                         
        </span>   
        <span
          className={
            emphasised ? "text-[15px] tabular-nums" : "text-[12px] tabular-nums"
          }                                                                                                                                                                               
          style={{
            fontFamily: MONO,                                                                                                                                                             
            color: emphasised
              ? AMBER
              : "rgba(255,255,255,0.85)",                                                                                                                                                 
          }}
        >                                                                                                                                                                                 
          {value} 
        </span>
      </div>
    );
  }