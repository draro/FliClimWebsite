'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, FileText, Plane, PlaneTakeoff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';

interface FPLFormProps {
  onVisualize: (data: any, fpl: string) => void;
  onLoad: () => void;
  routeData?: any;
}

const getCurrentDOF = () => {
  const now = new Date();
  return `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
};

const FPL_TEMPLATES = {
  'KJFK-KMIA': {
    name: 'New York (KJFK) to Miami (KMIA)',
    fpl: `(FPL-N123AB-IG
-B738/M-SDE2E3FGHIJ1J4J5J6RWXYZ/S
-KJFK1030
-N0350F350 DCT SIE J121 RADDS SWL DUNFE KALDA SAWED ORF J174 EDDYS GILMA CLAPY DIW AR19 SEELO JENKS M201 BAHAA AR15 HIBAC AR17 VKZ DCT
-KMIA0230
-PBN/A1B2C2D2 NAV/RNVD1E2A1 SUR/260B DOF/${getCurrentDOF()} REG/N123AB EET/KZDC0020 KZJX0050 KZMA0110 SEL/ABCD CODE/A12345 RVR/075 OPR/DOMINO PER/C RMK/TCAS)`
  },
  'KJFK-KSEA': {
    name: 'New York (KJFK) to Seattle (KSEA)',
    fpl: `(FPL-N123AB-IG
-B738/M-SDE2E3FGHIJ1J4J5J6RWXYZ/S
-KJFK1030
-N0450F350 DCT LAAYK Q436 YYOST DGRAF LHY45 MTCAF REBBL REXXY HERBA RAAKK Q438 FARGN ICHOL JAAJA TWIGS BERYS Q440 SLLAP DEANI IDIOM HUFFR Q146 SMERF TIMMR KIXCO Q142 OKVUJ KEETA MLP J70 EPH V120 OZALI DCT
-KSEA0500
-PBN/A1B2C2D2 NAV/RNVD1E2A1 SUR/260B DOF/${getCurrentDOF()} REG/N123AB EET/KZNY0020 KZOB0045 KZLC0340 KZSE0450 SEL/ABCD CODE/A12345 OPR/DOMINO PER/C RMK/TCAS)`
  },
  'KJFK-KLAX': {
    name: 'New York (KJFK) to Los Angeles (KLAX)',
    fpl: `(FPL-N123AB-IG
-B738/M-SDE2E3FGHIJ1J4J5J6RWXYZ/S
-KJFK1030
-N0450F350 DCT DUMMR V162 HWANG HOTEE ATIDE WHINE RIDNE EKURE ARRUY WAPKO BOBSS WAPKO HAR LOMON GRAHM ODUCY COFAX ZOTBI JFSON JST HINKS BLAYR NADNE WIBKI MILWO KALVE FURIX MILKE LENLE LMBRT JOMED AGC CRSBY RUDDS CANBI HEFJA BBLAK ACETE BOVPY PIDYY FEWGA XACJE WISKE NUSMM AVACA BAFEL CORVS ILAXE CTW HIDON TWAES WUMDO ROSCO CINAB TAZHU USEPE COGIT APE FABDO TEEZE TACES RITOQ EGUYY HUBIM HESAR JARTO HELDI DIPNE WESDA EMPTY ZEVAB VIBCO PIZZA DEAHD MECAN BONEE DEDVE JESTS TRUNC KURME DQN LEEDS ARBAS MOTTS YILEJ UWL NEWTO HOMAR ACIYU EMBOY JINIC ZAVNE FOVRA PUKAE COYLE CFDLD VHP JAAVE BOSTN GORDO SUBUE HIXAN HASSE LATHA BUDDY SATPY SPI HOMLA HUSKK FARGO CUBVO KUTLE DUCAD GELBE CITIX DAYYE BEWOH LUHVY BAYLI UKUCU TWAIN QOSME EDORE OKOYE CASAS EFAHA SALIE WEBEX JANSA SAAGS CUTAN FIGUN JAWED KK60G CAYKO OXIBE EVALN CROKS OVUSE UBADY CFPQX GONNR KRIKT CFBKV ACTIP MCI JUDGE VASCO ZITIK SLN RYLIE KD51Y LYSES LAA FABAP CAARS TEKAE MACOW ZARAT EYULE BORUM CHARM VIGIL WUBGI VPVTP BLOKE ALS COCAN RHYSS TBC GLACO KREME LRSON HEC
-KLAX0500
-PBN/A1B2C2D2 NAV/RNVD1E2A1 SUR/260B DOF/${getCurrentDOF()} REG/N123AB EET/KZNY0020 SEL/ABCD CODE/A12345 OPR/DOMINO PER/C RMK/TCAS)`
  }
};

export function FPLForm({ onVisualize, onLoad, routeData }: FPLFormProps) {
  const [activeTab, setActiveTab] = useState('manual');
  const [fpl, setFpl] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFPL = async () => {
    try {
      setIsSubmitting(true);
      onLoad();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000);

      const res = await fetch('https://demo.flyclim.com/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fpl }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      onVisualize(data, fpl);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        alert('Request timed out after 3 minutes. Please try again.');
      } else {
        alert('Failed to process flight plan. Please try again.');
      }
      console.error('FPL submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateSelect = (value: string) => {
    setSelectedTemplate(value);
    setFpl(FPL_TEMPLATES[value as keyof typeof FPL_TEMPLATES].fpl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-[360px] p-4 bg-white/95 shadow-lg backdrop-blur-sm border-blue-100">
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manual')}
            className="flex items-center gap-2 flex-1"
          >
            <Plane className="h-4 w-4" />
            Paste FPL
          </Button>
          <Button
            variant={activeTab === 'template' ? 'default' : 'outline'}
            onClick={() => setActiveTab('template')}
            className="flex items-center gap-2 flex-1"
          >
            <PlaneTakeoff className="h-4 w-4" />
            Templates
          </Button>
        </div>

        {activeTab === 'manual' ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">Paste Flight Plan</h3>
            <Textarea
              value={fpl}
              onChange={(e) => setFpl(e.target.value)}
              rows={6}
              className="mb-4 font-mono text-sm"
              placeholder="Paste your flight plan here..."
              disabled={isSubmitting}
            />
            <div className="flex gap-2">
              <Button
                onClick={submitFPL}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit FPL'}
              </Button>
              {routeData?.properties?.risk_factors && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      id="viewRisksButton"
                      variant="outline"
                      className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      View Risks
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Flight Risk Analysis
                      </DialogTitle>
                      <DialogDescription>
                        <div className="mt-4 space-y-4">
                          {routeData.properties.risk_factors?.map((risk: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-2 text-left"
                            >
                              <span className="text-red-500">{risk}</span>
                            </motion.div>
                          ))}
                          {routeData.properties.fpl_string && (
                            <motion.div
                              className="mt-6 pt-4 border-t"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                <FileText className="h-4 w-4" />
                                Updated Flight Plan
                              </h4>
                              <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap break-words">
                                {routeData.properties.fpl_string}
                              </pre>
                            </motion.div>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-2">Choose Flight Template</h3>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateSelect}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Select a flight route" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FPL_TEMPLATES).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={fpl}
              onChange={(e) => setFpl(e.target.value)}
              rows={6}
              className="mb-4 font-mono text-sm"
              placeholder="Flight plan will appear here..."
              disabled={isSubmitting}
            />
            <div className="flex gap-2">
              <Button
                onClick={submitFPL}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Template'}
              </Button>
              {routeData?.properties?.risk_factors && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      id="viewRisksButton"
                      variant="outline"
                      className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      View Risks
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Flight Risk Analysis
                      </DialogTitle>
                      <DialogDescription>
                        <div className="mt-4 space-y-4">
                          {routeData.properties.risk_factors?.map((risk: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-2 text-left"
                            >
                              <span className="text-red-500">{risk}</span>
                            </motion.div>
                          ))}
                          {routeData.properties.fpl_string && (
                            <motion.div
                              className="mt-6 pt-4 border-t"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                <FileText className="h-4 w-4" />
                                Updated Flight Plan
                              </h4>
                              <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap break-words">
                                {routeData.properties.fpl_string}
                              </pre>
                            </motion.div>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}