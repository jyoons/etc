const NX_GRID = function(nx){
  nx.init = function() {
    $(document).ready(function(){
      nx.resizer.init();
    });
  };

  nx.resizer = {
    box: null,
    grip: null,
    storageKey: 'gridLayout',

    init: function() {
      this.box = document.querySelector('.flexible-area');
      this.grip = document.querySelector('.grip-v');

      if (!this.box) return;

      this.setStorageKey();
      this.loadGridLayout();
      this.setEvent();
      this.initConvertPercent();

      window.resetGridLayout = this.resetGridLayout.bind(this);
    },

    setStorageKey: function() {
      const currentPage = window.location.pathname.split('/').pop() || 'default';
      const pageName = currentPage.replace('.html', '');
      this.storageKey = 'gridLayout_' + pageName;
    },

    setEvent: function() {
      if (this.grip) {
        this.grip.addEventListener('pointerdown', this.onGripDown.bind(this));
      }
      this.bindResizeEvents();
      this.setSortable();
      window.addEventListener('resize', this.onWindowResize.bind(this));
    },

    bindResizeEvents: function() {
      document.querySelectorAll('.resize-h, .resize-v').forEach(element => {
        element.removeEventListener('pointerdown', this.onHDown);
        element.removeEventListener('pointerdown', this.onVDown);
      });
      document.querySelectorAll('.grid-row .grid-area:not(:last-child) .resize-h')
        .forEach(h => h.addEventListener('pointerdown', this.onHDown.bind(this)));
      document.querySelectorAll('.grid-col .grid-area:not(:last-child) .resize-v')
        .forEach(h => h.addEventListener('pointerdown', this.onVDown.bind(this)));
      document.querySelectorAll('.grid-area .resize-v')
        .forEach(h => h.addEventListener('pointerdown', this.onVDown.bind(this)));
    },

    setSortable: function() {
      document.querySelectorAll('.grid-area').forEach(area => {
        area.draggable = true;
        area.addEventListener('dragstart', this.onDragStart.bind(this));
        area.addEventListener('dragover', this.onDragOver.bind(this));
        area.addEventListener('drop', this.onDrop.bind(this));
        area.addEventListener('dragend', this.onDragEnd.bind(this));
      });
    },

    initConvertPercent: function() {
      setTimeout(() => {
        this.convertPxToPercent();
      }, 100);
    },

    loadGridLayout: function() {
      const savedLayout = localStorage.getItem(this.storageKey);
      if (savedLayout) {
        const layout = JSON.parse(savedLayout);
        if (layout.gridTemplateRows && this.grip) {
          this.box.style.gridTemplateRows = layout.gridTemplateRows;
        }
        if (layout.cardSizes) {
          layout.cardSizes.forEach((size, index) => {
            const gridAreas = document.querySelectorAll('.grid-area');
            if (gridAreas[index] && size.width) {
              gridAreas[index].style.width = size.width;
              gridAreas[index].style.flex = 'none';
            }
            if (gridAreas[index] && size.height) {
              gridAreas[index].style.height = size.height;
              gridAreas[index].style.flex = 'none';
            }
          });
        }
      }
    },

    saveGridLayout: function() {// 변경 layout 저장
      const cardSizes = [];
      document.querySelectorAll('.grid-area').forEach(area => {
        cardSizes.push({
          width: area.style.width,
          height: area.style.height
        });
      });

      const layout = {
        cardSizes: cardSizes
      };

      if (this.grip) {
        layout.gridTemplateRows = this.box.style.gridTemplateRows;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(layout));
    },

    resetGridLayout: function() {
      localStorage.removeItem(this.storageKey);
      this.box.style.gridTemplateRows = '';
      document.querySelectorAll('.grid-area').forEach(area => {
        area.style.width = '';
        area.style.height = '';
        area.style.flex = '';
      });
    },

    convertPxToPercent: function() {
      document.querySelectorAll('.grid-area').forEach(area => {
        const parent = area.parentElement;
        if (!parent) return;

        if (area.style.width && area.style.width.includes('px')) {
          const widthPx = parseFloat(area.style.width);
          const parentWidth = parent.clientWidth;
          if (parentWidth > 0) {
            const widthPercent = (widthPx / parentWidth) * 100;
            area.style.width = Math.min(widthPercent, 100) + '%';
          }
        }

        if (area.style.height && area.style.height.includes('px')) {
          const heightPx = parseFloat(area.style.height);
          const parentHeight = parent.clientHeight;
          if (parentHeight > 0) {
            const heightPercent = (heightPx / parentHeight) * 100;
            area.style.height = Math.min(heightPercent, 100) + '%';
          }
        }
      });
    },

    gripActive: false,
    startY: 0,
    topH: 0,
    bottomH: 0,
    gripH: 0,

    onGripDown: function(e) {
      this.gripActive = true;
      this.startY = e.clientY;
      const row1 = document.querySelector('.grid-row.row-1');
      const row2 = document.querySelector('.grid-row.row-2');

      if (!row1 || !row2) return;

      const rect1 = row1.getBoundingClientRect();
      const rect2 = row2.getBoundingClientRect();
      this.gripH = this.grip.getBoundingClientRect().height || 12;

      this.topH = rect1.height;
      this.bottomH = rect2.height;

      document.body.classList.add('no-select');
      document.body.style.overflow = 'hidden';
      window.addEventListener('pointermove', this.onGripMove.bind(this));
      window.addEventListener('pointerup', this.onGripUp.bind(this));
    },

    onGripMove: function(e) {
      if (!this.gripActive) return;
      const dy = e.clientY - this.startY;

      const minRow = 100;
      const total = this.box.getBoundingClientRect().height - 36;
      let newTop = Math.max(minRow, Math.min(this.topH + dy, total - this.gripH - minRow));
      let newBottom = total - this.gripH - newTop;

      this.box.style.gridTemplateRows = `${newTop}px ${this.gripH}px ${newBottom}px`;
    },

    onGripUp: function() {
      this.gripActive = false;
      document.body.classList.remove('no-select');
      document.body.style.overflow = '';
      window.removeEventListener('pointermove', this.onGripMove.bind(this));
      window.removeEventListener('pointerup', this.onGripUp.bind(this));

      this.saveGridLayout();
    },

    activeTop: null,
    vStartY: 0,
    startTopH: 0,
    startBotH: 0,
    colH: 0,

    onVDown: function(e) {
      e.preventDefault();
      const topCard = e.currentTarget.closest('.grid-area');
      const col = topCard.parentElement;
      const botCard = topCard.nextElementSibling;
      if (!botCard || !botCard.classList.contains('grid-area')) return;

      this.activeTop = { topCard, botCard, col };
      this.vStartY = e.clientY;
      this.startTopH = topCard.offsetHeight;
      this.startBotH = botCard.offsetHeight;
      this.colH = col.clientHeight;

      document.body.classList.add('no-select');
      document.body.style.overflow = 'hidden';
      window.addEventListener('pointermove', this.onVMove.bind(this));
      window.addEventListener('pointerup', this.onVUp.bind(this));
    },

    onVMove: function(e) {
      if (!this.activeTop) return;
      const dy = e.clientY - this.vStartY;

      const minH = 100;
      const maxTop = this.colH - minH;
      const newTop = Math.max(minH, Math.min(this.startTopH + dy, maxTop));
      const newBot = this.colH - newTop;

      this.activeTop.topCard.style.height = newTop + 'px';
      this.activeTop.botCard.style.height = newBot + 'px';
      this.activeTop.topCard.style.flex = 'none';
      this.activeTop.botCard.style.flex = 'none';
    },

    onVUp: function() {
      this.activeTop = null;
      document.body.classList.remove('no-select');
      document.body.style.overflow = '';
      window.removeEventListener('pointermove', this.onVMove.bind(this));
      window.removeEventListener('pointerup', this.onVUp.bind(this));

      this.saveGridLayout();
    },

    activeLeft: null,
    hStartX: 0,
    startLeftW: 0,
    startRightW: 0,
    rowW: 0,

    onHDown: function(e) {
      e.preventDefault();
      const leftCard = e.currentTarget.closest('.grid-area');
      const row = leftCard.parentElement;
      const rightCard = leftCard.nextElementSibling;
      if (!rightCard || !rightCard.classList.contains('grid-area')) return;

      this.activeLeft = { leftCard, rightCard, row };
      this.hStartX = e.clientX;
      this.startLeftW = leftCard.offsetWidth;
      this.startRightW = rightCard.offsetWidth;
      this.rowW = row.clientWidth;

      document.body.classList.add('no-select');
      document.body.style.overflow = 'hidden';
      window.addEventListener('pointermove', this.onHMove.bind(this));
      window.addEventListener('pointerup', this.onHUp.bind(this));
    },

    onHMove: function(e) {
      if (!this.activeLeft) return;
      const dx = e.clientX - this.hStartX;

      const minW = 80;

      const newLeftW = Math.max(minW, this.startLeftW + dx);
      const newRightW = Math.max(minW, this.startRightW - dx);

      const actualLeftW = Math.min(newLeftW, this.startLeftW + this.startRightW - minW);
      const actualRightW = this.startLeftW + this.startRightW - actualLeftW;

      this.activeLeft.leftCard.style.width = actualLeftW + 'px';
      this.activeLeft.rightCard.style.width = actualRightW + 'px';
      this.activeLeft.leftCard.style.flex = 'none';
      this.activeLeft.rightCard.style.flex = 'none';
    },

    onHUp: function() {
      this.activeLeft = null;
      document.body.classList.remove('no-select');
      document.body.style.overflow = '';
      window.removeEventListener('pointermove', this.onHMove.bind(this));
      window.removeEventListener('pointerup', this.onHUp.bind(this));

      this.saveGridLayout();
    },

    onWindowResize: function() {
      this.convertPxToPercent();

      if (this.grip) {
        const cols = ['.grid-row.row-1', '.grid-row.row-2'];
        cols.forEach(className => {
          const col = document.querySelector(className);
          if (!col) return;
          const cards = col.querySelectorAll('.grid-area');
          if (cards.length !== 2) return;
          const h0 = cards[0].offsetHeight, h1 = cards[1].offsetHeight;
          const sum = h0 + h1;
          const H = col.clientHeight;
          if (sum === 0 || H === sum) return;
          const r0 = h0 / sum, r1 = h1 / sum;
          cards[0].style.height = (H * r0) + 'px';
          cards[1].style.height = (H * r1) + 'px';
          cards[0].style.flex = cards[1].style.flex = 'none';
        });
      }
    },

    draggedElement: null,

    onDragStart: function(e) {
      if (e.target.classList.contains('resize-h') || e.target.classList.contains('resize-v')) {
        e.preventDefault();
        return;
      }

      this.draggedElement = e.currentTarget;
      e.currentTarget.style.opacity = '0.5';
      e.currentTarget.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    },

    onDragOver: function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }

      if (e.currentTarget.classList.contains('grid-area')) {
        e.dataTransfer.dropEffect = 'move';

        if (this.draggedElement !== e.currentTarget) {
          e.currentTarget.classList.add('drag-over');
        }
      }
      return false;
    },

    onDrop: function(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      const dropTarget = e.currentTarget;

      if (this.draggedElement !== dropTarget && dropTarget.classList.contains('grid-area')) {
        const draggedParent = this.draggedElement.parentNode;
        const targetParent = dropTarget.parentNode;

        if (draggedParent === targetParent) {
          const draggedNext = this.draggedElement.nextSibling;
          const targetNext = dropTarget.nextSibling;

          if (draggedNext) {
            draggedParent.insertBefore(dropTarget, draggedNext);
          } else {
            draggedParent.appendChild(dropTarget);
          }

          if (targetNext) {
            targetParent.insertBefore(this.draggedElement, targetNext);
          } else {
            targetParent.appendChild(this.draggedElement);
          }
        } else {
          const draggedNext = this.draggedElement.nextSibling;
          const targetNext = dropTarget.nextSibling;

          if (targetNext) {
            targetParent.insertBefore(this.draggedElement, targetNext);
          } else {
            targetParent.appendChild(this.draggedElement);
          }

          if (draggedNext) {
            draggedParent.insertBefore(dropTarget, draggedNext);
          } else {
            draggedParent.appendChild(dropTarget);
          }
          this.adaptWidthForCrossRowMove(this.draggedElement, dropTarget, draggedParent, targetParent);
        }
        this.saveGridLayout();
        this.bindResizeEvents();
      }

      document.querySelectorAll('.grid-area').forEach(area => {
        area.classList.remove('drag-over');
      });

      return false;
    },

    onDragEnd: function(e) {
      e.currentTarget.style.opacity = '';
      e.currentTarget.classList.remove('dragging');

      document.querySelectorAll('.grid-area').forEach(area => {
        area.classList.remove('drag-over');
      });

      this.draggedElement = null;
    },

    adaptWidthForCrossRowMove: function(draggedElement, dropTarget, draggedParent, targetParent) {
      if (draggedParent !== targetParent) {
        const draggedWidth = draggedElement.style.width;
        const draggedFlex = draggedElement.style.flex;
        const targetWidth = dropTarget.style.width;
        const targetFlex = dropTarget.style.flex;

        draggedElement.style.width = targetWidth;
        draggedElement.style.flex = targetFlex;

        dropTarget.style.width = draggedWidth;
        dropTarget.style.flex = draggedFlex;

        setTimeout(() => {
          this.convertPxToPercent();
        }, 50);
      }
    },
  };

  nx.init();
  return nx;
}(window.NX_GRID || {}, jQuery);