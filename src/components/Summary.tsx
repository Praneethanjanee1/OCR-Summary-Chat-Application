import React from 'react';
import { Button, Card, Typography } from 'antd';
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface SummaryProps {
  text: string;
  summary: string;
  onBack: () => void;
  onQA: () => void;
}

const Summary: React.FC<SummaryProps> = ({ text, summary, onBack, onQA }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={onBack}
            className="mb-4"
          >
            Back to Upload
          </Button>
          <Title level={2}>Document Summary</Title>
          <Paragraph type="secondary">
            Here's the extracted text and its summary.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            title="Extracted Text" 
            className="h-full"
            bodyStyle={{ maxHeight: '500px', overflowY: 'auto' }}
          >
            <Paragraph className="whitespace-pre-line">{text}</Paragraph>
          </Card>

          <div className="space-y-6">
            <Card 
              title="Summary"
              className="h-full"
              bodyStyle={{ height: '300px', overflowY: 'auto' }}
            >
              <Paragraph className="whitespace-pre-line">{summary}</Paragraph>
            </Card>

            <Button 
              type="primary" 
              icon={<QuestionCircleOutlined />}
              onClick={onQA}
              block
              size="large"
            >
              Ask Questions about this Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;