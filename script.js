// Enhanced script.js with improved logo handling for PDF
document.addEventListener('DOMContentLoaded', function() {
    // Auto-move to next input for number fields
    function setupAutoMove(containerSelector, inputClass) {
        const container = document.querySelector(containerSelector);
        if (container) {
            const inputs = container.querySelectorAll(inputClass);
            inputs.forEach((input, index) => {
                input.addEventListener('input', function() {
                    if (this.value.length === parseInt(this.getAttribute('maxlength')) && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && this.value === '' && index > 0) {
                        inputs[index - 1].focus();
                    }
                });
            });
        }
    }

    // Setup auto-move for different input groups
    setupAutoMove('.porsi-inputs', '.porsi-box');
    setupAutoMove('.nik-inputs', '.nik-box');
    setupAutoMove('.phone-inputs', '.phone-box');
    setupAutoMove('.rekening-inputs', '.rekening-box');
    
    // Setup auto-move for date inputs
    document.querySelectorAll('.date-inputs').forEach(container => {
        const inputs = container.querySelectorAll('input[type="text"]');
        inputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                if (this.value.length === parseInt(this.getAttribute('maxlength')) && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
        });
    });

    // Only allow numbers for specific inputs
    function allowOnlyNumbers(selector) {
        document.querySelectorAll(selector).forEach(input => {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        });
    }

    allowOnlyNumbers('.porsi-box, .nik-box, .phone-box, .rekening-box, .date-box, .date-box-year, .small-box, .tahun-haji-input');

    // Enhanced function to convert image to base64
    function getImageAsBase64(src, callback) {
        // First try to get the image from the DOM if it exists
        const existingImg = document.querySelector('.header-logo');
        if (existingImg && existingImg.complete && existingImg.naturalWidth > 0) {
            convertDOMImageToBase64(existingImg, callback);
            return;
        }

        // Otherwise try to load it as a new image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            convertImageToBase64(this, callback);
        };
        
        img.onerror = function() {
            console.log('Could not load image from:', src);
            // Try alternative sources
            tryAlternativeLogoSources(callback);
        };
        
        img.src = src;
    }

    function convertDOMImageToBase64(imgElement, callback) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = imgElement.naturalWidth || imgElement.width || 200;
            canvas.height = imgElement.naturalHeight || imgElement.height || 200;
            
            ctx.drawImage(imgElement, 0, 0);
            
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL);
        } catch (e) {
            console.log('Could not convert DOM image to base64:', e);
            tryAlternativeLogoSources(callback);
        }
    }

    function convertImageToBase64(imgElement, callback) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            
            ctx.drawImage(imgElement, 0, 0);
            
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL);
        } catch (e) {
            console.log('Could not convert image to base64:', e);
            tryAlternativeLogoSources(callback);
        }
    }

    function tryAlternativeLogoSources(callback) {
        // Try different possible logo paths
        const logoSources = [
            './logo.png',
            '/logo.png',
            'assets/logo.png',
            'images/logo.png'
        ];
        
        let sourceIndex = 0;
        
        function tryNextSource() {
            if (sourceIndex >= logoSources.length) {
                // If all sources fail, create a default logo
                createDefaultLogo(callback);
                return;
            }
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = function() {
                convertImageToBase64(this, callback);
            };
            
            img.onerror = function() {
                sourceIndex++;
                tryNextSource();
            };
            
            img.src = logoSources[sourceIndex];
        }
        
        tryNextSource();
    }

    function createDefaultLogo(callback) {
        // Create a default logo using canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 200;
        canvas.height = 200;
        
        // Draw a simple logo
        ctx.fillStyle = '#2c5530';
        ctx.fillRect(0, 0, 200, 200);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('KEMENAG', 100, 80);
        ctx.fillText('ACEH', 100, 120);
        
        // Add border
        ctx.strokeStyle = '#28a745';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 200, 200);
        
        const dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
    }

    // PDF Generation with enhanced logo handling
    document.getElementById('downloadPDF').addEventListener('click', function() {
        if (validateForm()) {
            // Show loading indicator
            const btn = this;
            const originalText = btn.textContent;
            btn.textContent = 'Generating PDF...';
            btn.disabled = true;
            
            // Try to get logo with multiple fallback options
            getImageAsBase64('logo.png', function(logoBase64) {
                generatePDF(logoBase64);
                
                // Reset button
                btn.textContent = originalText;
                btn.disabled = false;
            });
        }
    });

    // Preview functionality
    document.getElementById('previewForm').addEventListener('click', function() {
        showPreview();
    });

    // Modal functionality
    const modal = document.getElementById('previewModal');
    const closeModal = document.querySelector('.close-modal');
    const closeModalBtn = document.querySelector('.btn-close-modal');

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function showPreview() {
        const formData = getFormData();
        const modal = document.getElementById('previewModal');
        const previewContent = document.getElementById('previewContent');
        
        const today = new Date();
        const dateStr = today.getDate() + ' ' + getMonthName(today.getMonth()) + ' ' + today.getFullYear();
        
       previewContent.innerHTML = `
            <div class="preview-header">
                <div class="preview-logo-section">
                    <img src="logo.png" alt="Logo Kemenag" class="preview-logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="preview-logo-fallback" style="display:none;">LOGO<br>KEMENAG</div>
                </div>
                <div class="preview-header-content">
                    <h1>KANTOR WILAYAH KEMENTERIAN AGAMA PROVINSI ACEH</h1>
                    <p>JALAN TGK. ABU LAIN U NO. 9 BANDA ACEH</p>
                    <h2>FORMULIR PENDAFTARAN PELIMPAHAN NOMOR PORSI HAJI</h2>
                    <h3>JEMAAH HAJI MENINGGAL/SAKIT PERMANEN</h3>
                </div>
            </div>
            
            <div class="preview-section">
                <div class="preview-section-title">A. JEMAAH PEMBERI PELIMPAHAN NOMOR PORSI HAJI</div>
                <div class="preview-row"><strong>1. Tgl. Wafat/Sakit:</strong> ${formData.deathDate}</div>
                <div class="preview-row"><strong>2. No. Porsi:</strong> ${formData.porsiNumber}</div>
                <div class="preview-row"><strong>3. Tempat Daftar Haji:</strong> ${formData.tempatDaftar}</div>
                <div class="preview-row"><strong>4. Nama Pemberi:</strong> ${formData.namaPemberi}</div>
                <div class="preview-row"><strong>5. Tempat/Tgl. Lahir:</strong> ${getFormattedBirthPlace(formData.tempatLahirPemberi, formData.tglLahirPemberi)}</div>
            </div>
            
            <div class="preview-section">
                <div class="preview-section-title">B. JEMAAH PENERIMA PELIMPAHAN NOMOR PORSI HAJI</div>
                <div class="preview-row"><strong>1. No. NIK:</strong> ${formData.nik}</div>
                <div class="preview-row"><strong>2. Nama Penerima:</strong> ${formData.namaPenerima}</div>
                <div class="preview-row"><strong>3. Nama Ayah Kandung:</strong> ${formData.namaAyah}</div>
                <div class="preview-row"><strong>4. Tempat/Tgl. Lahir:</strong> ${getFormattedBirthPlace(formData.tempatLahirPenerima, formData.tglLahirPenerima)}</div>
                <div class="preview-row"><strong>5. Jenis Kelamin:</strong> ${formData.jenisKelamin}</div>
                <div class="preview-row"><strong>6. Status Hubungan:</strong> ${formData.statusHubungan}</div>
                <div class="preview-row"><strong>7. Alamat Lengkap:</strong> ${formData.alamatLengkap}</div>
                ${getAddressDetails(formData)}
                <div class="preview-row"><strong>8. Kelurahan/Desa:</strong> ${formData.kelurahan}</div>
                <div class="preview-row"><strong>9. Kecamatan:</strong> ${formData.kecamatan}</div>
                <div class="preview-row"><strong>10. Kabupaten/Kota:</strong> ${getKabupatenWithProvince(formData.kabupaten)}</div>
                <div class="preview-row"><strong>11. Nomor HP:</strong> ${formData.nomorHP}</div>
                <div class="preview-row"><strong>12. Pekerjaan:</strong> ${formData.pekerjaan}</div>
                <div class="preview-row"><strong>13. Pendidikan:</strong> ${formData.pendidikan}</div>
                <div class="preview-row"><strong>14. Pengalaman Haji:</strong> ${formData.pengalamanHaji}</div>
                <div class="preview-row"><strong>15. Status Perkawinan:</strong> ${formData.statusPerkawinan}</div>
                <div class="preview-row"><strong>16. Nama Bank:</strong> ${formData.namaBank}</div>
                <div class="preview-row"><strong>17. Nomor Rekening:</strong> ${formData.nomorRekening}</div>
            </div>
            
            <div class="preview-signature">
                <div class="preview-signature-left">
                    <p>Petugas Verifikasi/Pendaftaran</p>
                    <div class="signature-line"></div>
                    <p>......................................................</p>
                    <p>NIP.</p>
                </div>
                <div class="preview-signature-right">
                    <p>Banda Aceh, ${dateStr}</p><br>
                    <p>Calon Jemaah Haji</p>
                    <div class="signature-line"></div>
                    <p>......................................................</p>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    function generatePDF(logoBase64) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Set font
        doc.setFont('helvetica');
        
        // Add logo - now with better error handling and positioning
        if (logoBase64) {
            try {
                // Add the logo with proper sizing and positioning
                doc.addImage(logoBase64, 'PNG', 15, 15, 30, 30);
                console.log('Logo successfully added to PDF');
            } catch (e) {
                console.log('Error adding logo to PDF:', e);
                // Fallback to text-based logo
                addTextLogo(doc);
            }
        } else {
            // Add text-based logo if no image available
            addTextLogo(doc);
        }
        
        // Header content (positioned to accommodate logo)
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('KANTOR WILAYAH KEMENTERIAN AGAMA PROVINSI ACEH', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('JALAN TGK. ABU LAIN U NO. 9 BANDA ACEH', 105, 28, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('FORMULIR PENDAFTARAN PELIMPAHAN NOMOR PORSI HAJI', 105, 38, { align: 'center' });
        
        doc.setFontSize(11);
        doc.text('JEMAAH HAJI MENINGGAL/SAKIT PERMANEN', 105, 46, { align: 'center' });
        
        // Line separator
        doc.setLineWidth(0.5);
        doc.line(15, 52, 195, 52);

        let y = 60;
        
        // Section A
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('A. JEMAAH PEMBERI PELIMPAHAN NOMOR PORSI HAJI', 15, y);
        y += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Get form data
        const formData = getFormData();
        
        // Section A fields
        doc.text(`1. Tgl. Wafat/Sakit: ${formData.deathDate}`, 20, y);
        y += 6;
        doc.text(`2. No. Porsi: ${formData.porsiNumber}`, 20, y);
        y += 6;
        doc.text(`3. Tempat Daftar Haji: ${formData.tempatDaftar}`, 20, y);
        y += 6;
        doc.text(`4. Nama Pemberi: ${formData.namaPemberi}`, 20, y);
        y += 6;
        doc.text(`5. Tempat/Tgl. Lahir: ${getFormattedBirthPlace(formData.tempatLahirPemberi, formData.tglLahirPemberi)}`, 20, y);
        y += 12;
        
        // Section B
        doc.setFont('helvetica', 'bold');
        doc.text('B. JEMAAH PENERIMA PELIMPAHAN NOMOR PORSI HAJI', 15, y);
        y += 8;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`1. No. NIK: ${formData.nik}`, 20, y);
        y += 6;
        doc.text(`2. Nama Penerima: ${formData.namaPenerima}`, 20, y);
        y += 6;
        doc.text(`3. Nama Ayah Kandung: ${formData.namaAyah}`, 20, y);
        y += 6;
        doc.text(`4. Tempat/Tgl. Lahir: ${getFormattedBirthPlace(formData.tempatLahirPenerima, formData.tglLahirPenerima)}`, 20, y);
        y += 6;
        doc.text(`5. Jenis Kelamin: ${formData.jenisKelamin}`, 20, y);
        y += 6;
        doc.text(`6. Status Hubungan: ${formData.statusHubungan}`, 20, y);
        y += 6;
        doc.text(`7. Alamat Lengkap: ${formData.alamatLengkap}`, 20, y);
        y += 6;
        
        const alamatDetail = getAddressDetailsForPDF(formData);
        if (alamatDetail) {
            doc.text(`   ${alamatDetail}`, 20, y);
            y += 6;
        }
        
        doc.text(`8. Kelurahan/Desa: ${formData.kelurahan}`, 20, y);
        y += 6;
        doc.text(`9. Kecamatan: ${formData.kecamatan}`, 20, y);
        y += 6;
        doc.text(`10. Kabupaten/Kota: ${getKabupatenWithProvince(formData.kabupaten)}`, 20, y);
        y += 6;
        doc.text(`11. Nomor HP: ${formData.nomorHP}`, 20, y);
        y += 6;
        doc.text(`12. Pekerjaan: ${formData.pekerjaan}`, 20, y);
        y += 6;
        doc.text(`13. Pendidikan: ${formData.pendidikan}`, 20, y);
        y += 6;
        doc.text(`14. Pengalaman Haji: ${formData.pengalamanHaji}`, 20, y);
        y += 6;
        doc.text(`15. Status Perkawinan: ${formData.statusPerkawinan}`, 20, y);
        y += 6;
        doc.text(`16. Nama Bank: ${formData.namaBank}`, 20, y);
        y += 6;
        doc.text(`17. Nomor Rekening: ${formData.nomorRekening}`, 20, y);
        y += 15;
        
        // Signature area
        const today = new Date();
        const dateStr = today.getDate() + ' ' + getMonthName(today.getMonth()) + ' ' + today.getFullYear();
        
        // Left side - Petugas Verifikasi
        doc.text('Petugas Verifikasi/Pendaftaran', 20, y);
        
        // Right side - Date and Calon Jemaah Haji
        doc.text(`Banda Aceh, ${dateStr}`, 140, y);
        y += 8;
        doc.text('Calon Jemaah Haji', 140, y);
        
        y += 25; // Space for signatures
        
        // Dotted lines for signatures
        doc.text('......................................................', 20, y);
        doc.text('......................................................', 140, y);
        
        y += 8;
        
        // NIP line for left side only
        doc.text('NIP.', 20, y);
        
        // Save PDF
        const filename = `Form_Pelimpahan_Haji_${formData.namaPenerima.replace(/\s+/g, '_')}_${today.getTime()}.pdf`;
        doc.save(filename);
        
        alert('PDF berhasil didownload dengan logo!');
    }

    // Helper function to add text-based logo when image fails
    function addTextLogo(doc) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        
        // Draw a rectangle for logo placeholder
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(15, 15, 30, 30);
        
        // Add text inside rectangle
        doc.text('LOGO', 30, 25, { align: 'center' });
        doc.text('KEMENAG', 30, 32, { align: 'center' });
        doc.text('ACEH', 30, 39, { align: 'center' });
        
        console.log('Text-based logo added to PDF');
    }

    function getFormData() {
        // Get death date
        const deathDay = document.getElementById('deathDay').value || '__';
        const deathMonth = document.getElementById('deathMonth').value || '__';
        const deathYear = document.getElementById('deathYear').value || '__';
        const deathDate = `${deathDay}-${deathMonth}-20${deathYear}`;
        
        // Get porsi number
        let porsiNumber = '';
        for (let i = 1; i <= 10; i++) {
            const porsiValue = document.getElementById(`porsi${i}`).value || '_';
            porsiNumber += porsiValue;
        }
        
        // Get birth date pemberi
        const tglPemberi = document.getElementById('tglLahirPemberi').value || '__';
        const blnPemberi = document.getElementById('blnLahirPemberi').value || '__';
        const thnPemberi = document.getElementById('thnLahirPemberi').value || '____';
        const tglLahirPemberi = `${tglPemberi}-${blnPemberi}-${thnPemberi}`;
        
        // Get NIK
        let nik = '';
        for (let i = 1; i <= 16; i++) {
            const nikValue = document.getElementById(`nik${i}`).value || '_';
            nik += nikValue;
        }
        
        // Get birth date penerima
        const tglPenerima = document.getElementById('tglLahirPenerima').value || '__';
        const blnPenerima = document.getElementById('blnLahirPenerima').value || '__';
        const thnPenerima = document.getElementById('thnLahirPenerima').value || '____';
        const tglLahirPenerima = `${tglPenerima}-${blnPenerima}-${thnPenerima}`;
        
        // Get phone number
        let nomorHP = '';
        for (let i = 1; i <= 12; i++) {
            const hpValue = document.getElementById(`hp${i}`).value || '_';
            nomorHP += hpValue;
        }
        
        // Get rekening number
        let nomorRekening = '';
        for (let i = 1; i <= 18; i++) {
            const rekValue = document.getElementById(`rek${i}`).value || '';
            nomorRekening += rekValue;
        }
        
        // Get radio button values
        const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked')?.value || '-';
        const statusHubungan = document.querySelector('input[name="statusHubungan"]:checked')?.value || '-';
        const pekerjaan = document.querySelector('input[name="pekerjaan"]:checked')?.value || '-';
        const pendidikan = document.querySelector('input[name="pendidikan"]:checked')?.value || '-';
        
        // Handle pengalaman haji with year
        const pengalamanHajiRadio = document.querySelector('input[name="pengalamanHaji"]:checked')?.value || '-';
        const tahunHaji = document.getElementById('tahunHaji').value;
        const pengalamanHaji = pengalamanHajiRadio === 'Pernah' && tahunHaji ? `Pernah Tahun ${tahunHaji}` : pengalamanHajiRadio;
        
        const statusPerkawinan = document.querySelector('input[name="statusPerkawinan"]:checked')?.value || '-';
        
        // Fix RT/RW combination
        const rt = document.getElementById('rt').value || '';
        const rw = document.getElementById('rw').value || '';
        const rtRw = (rt || rw) ? `${rt || '-'}/${rw || '-'}` : '';
        
        return {
            deathDate,
            porsiNumber,
            tempatDaftar: document.getElementById('tempatDaftar').value || '-',
            namaPemberi: document.getElementById('namaPemberi').value || '-',
            tempatLahirPemberi: document.getElementById('tempatLahirPemberi').value || '-',
            tglLahirPemberi,
            nik,
            namaPenerima: document.getElementById('namaPenerima').value || '-',
            namaAyah: document.getElementById('namaAyah').value || '-',
            tempatLahirPenerima: document.getElementById('tempatLahirPenerima').value || '-',
            tglLahirPenerima,
            jenisKelamin,
            statusHubungan,
            alamatLengkap: document.getElementById('alamatLengkap').value || '-',
            noRumah: document.getElementById('noRumah').value || '-',
            rtRw,
            kelurahan: document.getElementById('kelurahan').value || '-',
            kecamatan: document.getElementById('kecamatan').value || '-',
            kabupaten: document.getElementById('kabupaten').value || '-',
            nomorHP,
            pekerjaan,
            pendidikan,
            pengalamanHaji,
            statusPerkawinan,
            namaBank: document.getElementById('namaBank').value || '-',
            nomorRekening
        };
    }

    // Helper functions for formatting
    function getFormattedBirthPlace(tempat, tanggal) {
        const tempatValid = tempat && tempat !== '-';
        const tanggalValid = tanggal && tanggal !== '__-__-____';
        
        if (tempatValid && tanggalValid) {
            return `${tempat}, ${tanggal}`;
        } else if (tempatValid) {
            return tempat;
        } else if (tanggalValid) {
            return tanggal;
        } else {
            return '-';
        }
    }

    function getKabupatenWithProvince(kabupaten) {
        return kabupaten && kabupaten !== '-' ? `${kabupaten}, Provinsi Aceh` : '-';
    }

    function getAddressDetails(formData) {
        const details = [];
        if (formData.noRumah && formData.noRumah !== '-') {
            details.push(`No. ${formData.noRumah}`);
        }
        if (formData.rtRw) {
            details.push(`RT/RW ${formData.rtRw}`);
        }
        
        if (details.length > 0) {
            return `<div class="preview-row" style="margin-left: 20px;">${details.join(' ')}</div>`;
        }
        return '';
    }

    function getAddressDetailsForPDF(formData) {
        const details = [];
        if (formData.noRumah && formData.noRumah !== '-') {
            details.push(`No. ${formData.noRumah}`);
        }
        if (formData.rtRw) {
            details.push(`RT/RW ${formData.rtRw}`);
        }
        return details.length > 0 ? details.join(' ') : '';
    }
    
    function getMonthName(monthIndex) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return months[monthIndex];
    }

    // Form validation before PDF generation
    function validateForm() {
        const requiredFields = [
            'namaPenerima', 'namaAyah', 'alamatLengkap', 'kelurahan', 
            'kecamatan', 'kabupaten'
        ];
        
        let isValid = true;
        let missingFields = [];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                isValid = false;
                missingFields.push(field.previousElementSibling.textContent);
                field.style.borderColor = '#dc3545';
            } else {
                field.style.borderColor = '#ccc';
            }
        });
        
        // Check if at least some NIK digits are filled
        let nikFilled = false;
        for (let i = 1; i <= 16; i++) {
            if (document.getElementById(`nik${i}`).value) {
                nikFilled = true;
                break;
            }
        }
        
        if (!nikFilled) {
            isValid = false;
            missingFields.push('NIK');
        }
        
        if (!isValid) {
            alert('Mohon lengkapi field berikut:\n- ' + missingFields.join('\n- '));
            return false;
        }
        
        return true;
    }
    
    // Add form reset confirmation
    document.querySelector('.btn-reset').addEventListener('click', function(e) {
        if (!confirm('Apakah Anda yakin ingin mengosongkan semua data form?')) {
            e.preventDefault();
        }
    });

    // Auto-format input styling
    function addInputFocusEffects() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="radio"]');
        
        inputs.forEach(input => {
            if (input.type === 'text') {
                input.addEventListener('focus', function() {
                    this.style.borderColor = '#28a745';
                    this.style.boxShadow = '0 0 5px rgba(40, 167, 69, 0.3)';
                });
                
                input.addEventListener('blur', function() {
                    this.style.borderColor = '#ccc';
                    this.style.boxShadow = 'none';
                });
            }
        });
    }
    
    addInputFocusEffects();
    
    // Handle pengalaman haji year input
    const belumPernahRadio = document.getElementById('belumPernah');
    const pernahRadio = document.getElementById('pernah');
    const tahunHajiInput = document.getElementById('tahunHaji');
    
    function toggleTahunHaji() {
        if (pernahRadio.checked) {
            tahunHajiInput.disabled = false;
            tahunHajiInput.style.backgroundColor = '#fff';
            tahunHajiInput.focus();
        } else {
            tahunHajiInput.disabled = true;
            tahunHajiInput.style.backgroundColor = '#f5f5f5';
            tahunHajiInput.value = '';
        }
    }
    
    belumPernahRadio.addEventListener('change', toggleTahunHaji);
    pernahRadio.addEventListener('change', toggleTahunHaji);
    
    // Initialize state
    toggleTahunHaji();
    
    // Auto-save functionality (using variables instead of localStorage)
    let autoSaveData = {};
    
    function autoSave() {
        const formData = {};
        const inputs = document.querySelectorAll('input');
        
        inputs.forEach(input => {
            if (input.type === 'radio') {
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else {
                formData[input.id] = input.value;
            }
        });
        
        autoSaveData = formData;
    }
    
    // Load saved form data
    function loadSavedData() {
        if (Object.keys(autoSaveData).length > 0) {
            Object.keys(autoSaveData).forEach(key => {
                const element = document.getElementById(key) || document.querySelector(`input[name="${key}"][value="${autoSaveData[key]}"]`);
                if (element) {
                    if (element.type === 'radio') {
                        element.checked = true;
                    } else {
                        element.value = autoSaveData[key];
                    }
                }
            });
        }
    }
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
    
    // Save on form change
    document.addEventListener('change', autoSave);
    document.addEventListener('input', autoSave);
    
    // Clear saved data on form reset
    document.querySelector('.btn-reset').addEventListener('click', function() {
        autoSaveData = {};
    });
    
    console.log('Form Pendaftaran Haji initialized successfully with enhanced logo support!');
});