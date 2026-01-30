/**
 * Dossier XML Parser
 * Parses the dossier XML structure into a navigable JavaScript object
 */

class DossierParser {
  constructor() {
    this.dossier = null;
    this.documents = [];
    this.metadata = {};
  }

  /**
   * Parse XML string into structured dossier object
   */
  parse(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('XML parsing failed: ' + parseError.textContent);
    }

    const dossierElement = xmlDoc.querySelector('Dossier');
    if (!dossierElement) {
      throw new Error('Invalid dossier format: missing Dossier root element');
    }

    this.dossier = {
      title: dossierElement.getAttribute('title') || 'Dossier',
      metadata: this.parseMetadata(dossierElement),
      documents: this.parseDocuments(dossierElement)
    };

    return this.dossier;
  }

  /**
   * Parse global metadata
   */
  parseMetadata(dossierElement) {
    const metadata = {};
    const metadataElement = dossierElement.querySelector('GlobalMetadata');

    if (metadataElement) {
      const metaItems = metadataElement.querySelectorAll('MetaItem');
      metaItems.forEach(item => {
        const key = item.getAttribute('key');
        const value = item.textContent.trim();
        if (key) {
          metadata[key] = value;
        }
      });
    }

    return metadata;
  }

  /**
   * Parse all documents
   */
  parseDocuments(dossierElement) {
    const documents = [];
    const docElements = dossierElement.querySelectorAll(':scope > Document');

    docElements.forEach((docElement, index) => {
      documents.push(this.parseDocument(docElement, index));
    });

    return documents;
  }

  /**
   * Parse a single document
   */
  parseDocument(docElement, index) {
    const sourceFile = docElement.getAttribute('source_file') || `document-${index}`;
    const bodyElement = docElement.querySelector('Body');

    const document = {
      id: this.generateId(sourceFile),
      sourceFile: sourceFile,
      title: this.extractDocumentTitle(bodyElement, sourceFile),
      sections: []
    };

    if (bodyElement) {
      document.sections = this.parseSections(bodyElement);
    }

    return document;
  }

  /**
   * Extract document title from first section
   */
  extractDocumentTitle(bodyElement, fallback) {
    if (!bodyElement) return fallback;

    const firstSection = bodyElement.querySelector(':scope > Section');
    if (firstSection) {
      return firstSection.getAttribute('title') || fallback;
    }

    return fallback;
  }

  /**
   * Parse sections recursively
   */
  parseSections(parentElement) {
    const sections = [];
    const sectionElements = parentElement.querySelectorAll(':scope > Section');

    sectionElements.forEach(sectionElement => {
      sections.push(this.parseSection(sectionElement));
    });

    return sections;
  }

  /**
   * Parse a single section
   */
  parseSection(sectionElement) {
    const title = sectionElement.getAttribute('title') || '';
    const level = parseInt(sectionElement.getAttribute('level'), 10) || 1;

    const section = {
      id: this.generateId(title),
      title: title,
      level: level,
      content: [],
      subsections: []
    };

    // Parse content elements in order
    const children = Array.from(sectionElement.children);

    children.forEach(child => {
      switch (child.tagName) {
        case 'Section':
          section.subsections.push(this.parseSection(child));
          break;
        case 'DataPoint':
          section.content.push(this.parseDataPoint(child));
          break;
        case 'Paragraph':
          section.content.push({
            type: 'paragraph',
            text: child.textContent.trim()
          });
          break;
        case 'List':
          section.content.push(this.parseList(child));
          break;
      }
    });

    return section;
  }

  /**
   * Parse a data point
   */
  parseDataPoint(element) {
    return {
      type: 'datapoint',
      key: element.getAttribute('key') || '',
      value: element.textContent.trim()
    };
  }

  /**
   * Parse a list
   */
  parseList(element) {
    const items = [];
    const itemElements = element.querySelectorAll(':scope > Item');

    itemElements.forEach(item => {
      items.push(item.textContent.trim());
    });

    return {
      type: 'list',
      ordered: element.getAttribute('type') === 'ordered',
      items: items
    };
  }

  /**
   * Generate a URL-safe ID from a string
   */
  generateId(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens
      .substring(0, 50) // Limit length
      .replace(/^-|-$/g, ''); // Trim hyphens
  }

  /**
   * Get flat list of all sections for search
   */
  getAllSections() {
    const allSections = [];

    const flattenSections = (sections, documentId, parentPath = '') => {
      sections.forEach(section => {
        const path = parentPath ? `${parentPath} > ${section.title}` : section.title;
        allSections.push({
          ...section,
          documentId,
          path,
          searchText: this.getSectionSearchText(section)
        });

        if (section.subsections.length > 0) {
          flattenSections(section.subsections, documentId, path);
        }
      });
    };

    this.dossier.documents.forEach(doc => {
      flattenSections(doc.sections, doc.id);
    });

    return allSections;
  }

  /**
   * Get searchable text from a section
   */
  getSectionSearchText(section) {
    let text = section.title + ' ';

    section.content.forEach(item => {
      switch (item.type) {
        case 'paragraph':
          text += item.text + ' ';
          break;
        case 'datapoint':
          text += item.key + ' ' + item.value + ' ';
          break;
        case 'list':
          text += item.items.join(' ') + ' ';
          break;
      }
    });

    return text.toLowerCase();
  }
}

// Export for use in app.js
window.DossierParser = DossierParser;
