import { render, screen } from '@testing-library/react';
import { AssetDownloadCard } from './AssetDownloadCard';
import type { AssetCategory } from '@/types/media-kit';

describe('AssetDownloadCard Component', () => {
  const mockCategory: AssetCategory = {
    id: 1,
    title: 'Logos',
    description: 'AutoCap Group logos in multiple formats for print and digital use.',
    order: 1,
    assets: [
      {
        id: 1,
        name: 'AutoCap Logo (SVG)',
        description: 'Vector logo for digital use - light background',
        format: 'SVG',
        order: 1,
        fileUrl: '/media-kit/logo-autocap-light.svg',
      },
      {
        id: 2,
        name: 'AutoCap Logo (PNG)',
        description: 'Raster logo for digital use - light background',
        format: 'PNG',
        size: '2000×800px',
        order: 2,
        fileUrl: '/media-kit/logo-autocap-light.png',
      },
    ],
  };

  describe('Category Header', () => {
    it('renders category title', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getByText(mockCategory.title)).toBeInTheDocument();
    });

    it('renders category description', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getByText(mockCategory.description)).toBeInTheDocument();
    });

    it('title is h3 heading', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent(mockCategory.title);
    });

    it('title is emphasized', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('font-bold');
    });
  });

  describe('Asset Rendering', () => {
    it('renders all assets', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      mockCategory.assets.forEach(asset => {
        expect(screen.getByText(asset.name)).toBeInTheDocument();
      });
    });

    it('renders asset descriptions', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      mockCategory.assets.forEach(asset => {
        expect(screen.getByText(asset.description)).toBeInTheDocument();
      });
    });

    it('renders correct number of assets', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      const downloadButtons = screen.getAllByLabelText(/Download/);
      expect(downloadButtons).toHaveLength(mockCategory.assets.length);
    });
  });

  describe('Format Badges', () => {
    it('displays format badges for all assets', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getByText('SVG')).toBeInTheDocument();
      expect(screen.getByText('PNG')).toBeInTheDocument();
    });

    it('SVG badge has blue color', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getByText('SVG')).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('PNG badge has green color', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getByText('PNG')).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('PDF badge has red color', () => {
      const pdfCategory: AssetCategory = {
        id: 2,
        title: 'Brand Colors',
        description: 'Color palette',
        order: 2,
        assets: [{ id: 3, name: 'Colors PDF', description: 'PDF file', format: 'PDF', order: 1 }],
      };
      render(<AssetDownloadCard category={pdfCategory} />);
      expect(screen.getByText('PDF')).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('ZIP badge has purple color', () => {
      const zipCategory: AssetCategory = {
        id: 3,
        title: 'Photos',
        description: 'Photo archive',
        order: 3,
        assets: [
          { id: 4, name: 'Photos ZIP', description: 'ZIP archive', format: 'ZIP', order: 1 },
        ],
      };
      render(<AssetDownloadCard category={zipCategory} />);
      expect(screen.getByText('ZIP')).toHaveClass('bg-purple-100', 'text-purple-800');
    });
  });

  describe('File Size Display', () => {
    it('displays file size when provided', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getByText('2000×800px')).toBeInTheDocument();
    });
  });

  describe('Download Buttons', () => {
    it('renders download button for each asset', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getAllByLabelText(/Download/)).toHaveLength(mockCategory.assets.length);
    });

    it('download buttons have correct href when fileUrl provided', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      const svgButton = screen.getByLabelText('Download AutoCap Logo (SVG)');
      expect(svgButton).toHaveAttribute('href', '/media-kit/logo-autocap-light.svg');
    });

    it('download buttons fall back to # when no fileUrl', () => {
      const noFileCategory: AssetCategory = {
        id: 4,
        title: 'Test',
        description: 'Test',
        order: 1,
        assets: [
          { id: 5, name: 'No File Asset', description: 'No file yet', format: 'PDF', order: 1 },
        ],
      };
      render(<AssetDownloadCard category={noFileCategory} />);
      expect(screen.getByLabelText('Download No File Asset')).toHaveAttribute('href', '#');
    });

    it('download buttons have accessible labels', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getByLabelText('Download AutoCap Logo (SVG)')).toBeInTheDocument();
      expect(screen.getByLabelText('Download AutoCap Logo (PNG)')).toBeInTheDocument();
    });

    it('download buttons use AutoCap Red color', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      expect(screen.getByLabelText('Download AutoCap Logo (SVG)')).toHaveClass('bg-[#C8102E]');
    });
  });

  describe('Card Styling', () => {
    it('has white background', () => {
      const { container } = render(<AssetDownloadCard category={mockCategory} />);
      expect(container.firstChild).toHaveClass('bg-white');
    });

    it('has border', () => {
      const { container } = render(<AssetDownloadCard category={mockCategory} />);
      expect(container.firstChild).toHaveClass('border', 'border-gray-200');
    });

    it('has rounded corners', () => {
      const { container } = render(<AssetDownloadCard category={mockCategory} />);
      expect(container.firstChild).toHaveClass('rounded-lg');
    });

    it('has shadow', () => {
      const { container } = render(<AssetDownloadCard category={mockCategory} />);
      expect(container.firstChild).toHaveClass('shadow-sm');
    });

    it('has hover shadow effect', () => {
      const { container } = render(<AssetDownloadCard category={mockCategory} />);
      expect(container.firstChild).toHaveClass('hover:shadow-md');
    });
  });

  describe('Accessibility', () => {
    it('download links are keyboard accessible', () => {
      render(<AssetDownloadCard category={mockCategory} />);
      screen.getAllByLabelText(/Download/).forEach(button => {
        expect(button.tagName).toBe('A');
      });
    });

    it('has semantic HTML structure', () => {
      const { container } = render(<AssetDownloadCard category={mockCategory} />);
      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('a[href]')).toBeInTheDocument();
    });
  });
});
