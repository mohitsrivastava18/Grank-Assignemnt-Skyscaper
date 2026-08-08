document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appointment-form");
    const successModal = document.getElementById("success-modal");

    // Inputs
    const fields = {
        fullName: {
            el: document.getElementById("fullName"),
            error: document.getElementById("name-error"),
            validate: (val) => {
                const nameRegex = /^[A-Za-z\s]{3,}$/;
                return nameRegex.test(val.trim());
            }
        },
        email: {
            el: document.getElementById("email"),
            error: document.getElementById("email-error"),
            validate: (val) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(val.trim());
            }
        },
        phone: {
            el: document.getElementById("phone"),
            error: document.getElementById("phone-error"),
            validate: (val) => {
                const phoneRegex = /^[6-9]\d{9}$/;
                return phoneRegex.test(val.trim());
            }
        },
        visitDate: {
            el: document.getElementById("visitDate"),
            error: document.getElementById("date-error"),
            validate: (val) => {
                if (!val) return false;
                const selectDate = new Date(val);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectDate >= today;
            }
        },
        visitors: {
            el: document.getElementById("visitors"),
            error: document.getElementById("visitors-error"),
            validate: (val) => val !== "" && val !== null
        },
        tower: {
            el: document.getElementById("tower"),
            error: document.getElementById("tower-error"),
            validate: (val) => val !== "" && val !== null
        }
    };

    // Set minimum date attributes in real-time
    const setMinDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = `${yyyy}-${mm}-${dd}`;
        fields.visitDate.el.setAttribute("min", formattedToday);
    };

    setMinDate();

    // Helper functions for classes
    const showSuccess = (fieldKey) => {
        const field = fields[fieldKey];
        const group = field.el.closest(".form-group");
        group.classList.remove("invalid");
        group.classList.add("valid");
        field.error.style.display = "none";
    };

    const showError = (fieldKey) => {
        const field = fields[fieldKey];
        const group = field.el.closest(".form-group");
        group.classList.remove("valid");
        group.classList.add("invalid");
        field.error.style.display = "block";
    };

    const validateField = (key) => {
        const field = fields[key];
        const isValid = field.validate(field.el.value);
        if (isValid) {
            showSuccess(key);
        } else {
            showError(key);
        }
        return isValid;
    };

    // Attach listeners for dynamic feedback
    Object.keys(fields).forEach(key => {
        const input = fields[key].el;
        
        // Input or change events
        const eventName = input.tagName === "SELECT" ? "change" : "input";
        input.addEventListener(eventName, () => {
            validateField(key);
        });

        // Blur event validation
        input.addEventListener("blur", () => {
            validateField(key);
        });
    });

    // Time slots handling (radios)
    const timeSlotRadios = document.querySelectorAll('input[name="timeSlot"]');
    const slotError = document.getElementById("slot-error");

    const validateTimeSlot = () => {
        let isSelected = false;
        timeSlotRadios.forEach(radio => {
            if (radio.checked) isSelected = true;
        });

        const container = document.querySelector(".time-slots-grid");
        if (isSelected) {
            container.classList.remove("invalid");
            slotError.style.display = "none";
        } else {
            container.classList.add("invalid");
            slotError.style.display = "block";
        }
        return isSelected;
    };

    timeSlotRadios.forEach(radio => {
        radio.addEventListener("change", validateTimeSlot);
    });

    // Form Submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        
        Object.keys(fields).forEach(key => {
            const isValid = validateField(key);
            if (!isValid) isFormValid = false;
        });

        const isSlotValid = validateTimeSlot();
        if (!isSlotValid) isFormValid = false;

        if (isFormValid) {
            // Success animation flow
            const submitBtn = form.querySelector(".submit-booking-btn");
            submitBtn.classList.add("loading");
            submitBtn.disabled = true;

            setTimeout(() => {
                // Populate details and show success modal
                const bookingId = "CC-" + Math.floor(1000 + Math.random() * 9000);
                const selectedSlot = document.querySelector('input[name="timeSlot"]:checked').value;
                
                document.getElementById("summary-booking-id").textContent = bookingId;
                document.getElementById("summary-name").textContent = fields.fullName.el.value;
                document.getElementById("summary-date").textContent = fields.visitDate.el.value;
                document.getElementById("summary-time").textContent = selectedSlot;
                document.getElementById("summary-tower").textContent = fields.tower.el.value;

                // Reset forms
                form.reset();
                Object.keys(fields).forEach(key => {
                    const group = fields[key].el.closest(".form-group");
                    group.classList.remove("valid", "invalid");
                });
                document.querySelector(".time-slots-grid").classList.remove("invalid");
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;

                // Open modal
                successModal.classList.add("active");
            }, 1800); // 1.8s premium transition delay
        } else {
            // Scroll to the first error input
            const firstErrorGroup = document.querySelector(".form-group.invalid");
            if (firstErrorGroup) {
                firstErrorGroup.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    });
});
