import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import path from 'path';
import Labels from '../../public/js/workflow-ui/labels';

beforeEach(async () => {
  const dom = await JSDOM.fromFile(path.resolve(__dirname, 'labels.html'), { url: 'http://localhost' });
  global.window = dom.window as unknown as Window & typeof globalThis;
  global.document = dom.window.document;
});

describe('labels.js', () => { 
  describe('promoteLabels', () => {
    it('promotes the given list of labels', () => {
      const labelsListElement = document.getElementById('labels-list');
      const greenLi = labelsListElement.querySelector('a[name="green"]').closest('li');
      Labels.promoteLabels(['green']);
      const isPromoted = greenLi.classList.contains('label-promoted');
      expect(isPromoted);
    });
  });
  describe('demoteLabels', () => {
    it('demotes all promoted labels and removes clones', () => {
      const labelsListElement = document.getElementById('labels-list');
      Labels.promoteLabels(['green']);
      Labels.demoteLabels();
      const greenLi = labelsListElement.querySelector('a[name="green"]').closest('li');
      const isPromoted = greenLi.classList.contains('label-promoted');
      expect(!isPromoted);
      const clones = Array.from(document.getElementsByClassName('label-clone'));
      expect(clones.length).to.equal(0);
    });
  });
  describe('getLabelsIntersectionForSelectedJobs', () => {
    it('gets the intersection set of labels for selected jobs', () => {
      (document.getElementById('select-058184f7-498c-4aa5-a3df-96a3a49b7d19') as HTMLInputElement).checked = true;
      (document.getElementById('select-38d2b820-0b52-475d-8cb0-0b9f7775f767') as HTMLInputElement).checked = true;
      expect(Labels.getLabelsIntersectionForSelectedJobs()).to.deep.equal(['blue']);
    });
    it('returns [] when there are no selected jobs', () => {
      expect(Labels.getLabelsIntersectionForSelectedJobs()).to.deep.equal([]);
    });
  });
  describe('setLabelLinksDisabled', () => {
    it('sets all label links disabled when 0 jobs are selected', () => {
      const labelLinks = Array.from(document.querySelectorAll('#labels-list .label-li a'));
      Labels.setLabelLinksDisabled(0, labelLinks);
      const disabledLabelLinks = Array.from(document.querySelectorAll('#labels-list .label-li a.disabled'));
      expect(disabledLabelLinks.length).to.equal(3);
    });
  });
  describe('setLabelLinksEnabled', () => {
    it('sets all label links enabled', () => {
      const labelLinks = Array.from(document.querySelectorAll('#labels-list .label-li a'));
      Labels.setLabelLinksDisabled(0, labelLinks);
      Labels.setLabelLinksEnabled(labelLinks);
      for (const l of labelLinks) {
        expect(!l.classList.contains('disabled'));
      }
    });
  });
});
