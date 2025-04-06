document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('serviceForm');
    const submitButton = document.querySelector('.submit-services');
    const selectedServicesList = document.getElementById('selectedServicesList');
    const clearCartButton = document.getElementById('clearCart');
    const downloadButton = document.getElementById('downloadServices');
    
    // Company page logic
    if (form) {
        let servicesCart = JSON.parse(localStorage.getItem('servicesCart')) || [];
        const companyName = document.querySelector('.company-name')?.textContent;
    
        // Handle checkbox changes
        form.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                const serviceLabel = e.target.closest('.service-label');
                const serviceName = serviceLabel.querySelector('h3').textContent;
                const serviceDescription = serviceLabel.querySelector('p').textContent;
    
                if (e.target.checked) {
                    if (!servicesCart.some(s => s.name === serviceName && s.company === companyName)) {
                        servicesCart.push({
                            name: serviceName,
                            description: serviceDescription,
                            company: companyName
                        });
                        serviceLabel.closest('.service-item').classList.add('selected');
                    }
                } else {
                    servicesCart = servicesCart.filter(s => 
                        !(s.name === serviceName && s.company === companyName)
                    );
                    serviceLabel.closest('.service-item').classList.remove('selected');
                }
    
                localStorage.setItem('servicesCart', JSON.stringify(servicesCart));
            }
        });
    
        // Check boxes of already selected services
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const serviceLabel = checkbox.closest('.service-label');
            const serviceName = serviceLabel.querySelector('h3').textContent;
            
            if (servicesCart.some(s => s.name === serviceName && s.company === companyName)) {
                checkbox.checked = true;
                serviceLabel.closest('.service-item').classList.add('selected');
            }
        });
    }

    // Selected services page logic
    if (selectedServicesList) {
        const servicesCart = JSON.parse(localStorage.getItem('servicesCart')) || [];
        
        if (servicesCart.length === 0) {
            selectedServicesList.innerHTML = '<p>No hay servicios seleccionados</p>';
            if (clearCartButton) clearCartButton.style.display = 'none';
            if (downloadButton) downloadButton.style.display = 'none';
        } else {
            const html = servicesCart.map((service, index) => `
                <div class="service-item">
                    <label class="service-label">
                        <div class="service-content">
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
                        </div>
                    </label>
                </div>
            `).join('');
    
            selectedServicesList.innerHTML = html;
            if (clearCartButton) clearCartButton.style.display = 'block';
            if (downloadButton) downloadButton.style.display = 'block';
        }

        // Clear cart button handler
        if (clearCartButton) {
            function clearServices() {
                localStorage.removeItem('servicesCart');
                selectedServicesList.innerHTML = '<p>No hay servicios seleccionados</p>';
                clearCartButton.style.display = 'none';
                downloadButton.style.display = 'none';
            }

            document.getElementById('clearCart').addEventListener('click', function() {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Se eliminarán todos los servicios seleccionados",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#e74c3c',
                    cancelButtonColor: '#95a5a6',
                    confirmButtonText: 'Sí, vaciar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        clearServices();
                        Swal.fire(
                            '¡Vaciado!',
                            'Los servicios han sido eliminados.',
                            'success'
                        )
                    }
                })
            });
        }

        // Download button handler
        // Download handler - update styles
        if (downloadButton) {
            downloadButton.addEventListener('click', function() {
                const servicesCart = JSON.parse(localStorage.getItem('servicesCart')) || [];
                
                let content = `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Servicios Seleccionados</title>
                    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet">
                    <style>
                        * { font-family: 'Ubuntu', sans-serif; }
                        body { max-width: 800px; margin: 40px auto; padding: 20px; }
                        .service-item { 
                            margin-bottom: 30px; 
                            padding: 20px; 
                            border: 1px solid #eee; 
                            border-radius: 8px;
                            background: #fff;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .service-content { padding: 15px; }
                        h2 { color: #2c3e50; margin-bottom: 15px; font-weight: 500; }
                        p { color: #666; line-height: 1.6; font-weight: 300; margin: 10px 0; }
                        .company-tag { 
                            display: block;
                            color: #95a5a6;
                            margin-top: 15px;
                            font-style: italic;
                        }
                    </style>
                </head>
                <body>`;
    
                content += servicesCart.map((service, index) => `
                <div class="service-item">
                    <div class="service-content">
                        <h2>${index + 1}. ${service.name}</h2>
                        <p>${service.description}</p>
                    </div>
                </div>`).join('');
    
                content += `</body></html>`;

                const blob = new Blob([content], { type: 'text/html' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'servicios-seleccionados.html';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });
        }
    }
});