# <font color="45ee61">Risposta di ChatGPT</font>

There are a few issues in your query that need to be corrected:  

### **Issues in your Query:**
1. **Incorrect time range condition**  
   - The correct way to specify the time range crossing midnight is:
     ```sql
     (TIME(column) BETWEEN '22:00:00' AND '23:59:59' OR TIME(column) BETWEEN '00:00:00' AND '05:59:59')
     ```
   - The `BETWEEN '22:00:00' AND '24:00:00'` is incorrect since `24:00:00` is not a valid time.

2. **Incorrect `WHERE` condition for date filtering**  
   - You are checking `DATE(presser_bale.data_ins) = CURDATE()` but this excludes rows that belong to the time range **after midnight** (which belongs to the next day).
   - A correct approach is:
     ```sql
     (presser_bale.data_ins BETWEEN CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 22:00:00') 
                              AND CONCAT(CURDATE(), ' 05:59:59'))
     ```
   - This ensures you are selecting data that falls between **yesterday at 22:00** and **today at 06:00**.

---

### **Fixed Query:**
```sql
SELECT 
    code_plastic.code, 
    SUM(wheelman_bale.weight) AS totale_peso,
    COUNT(pb_wb.id_pb) AS totale_balle
FROM 
    code_plastic
LEFT JOIN presser_bale 
    ON presser_bale.id_plastic = code_plastic.code
LEFT JOIN pb_wb 
    ON pb_wb.id_pb = presser_bale.id
LEFT JOIN wheelman_bale
    ON pb_wb.id_wb = wheelman_bale.id
WHERE 
    pb_wb.id_implant = 1
    AND presser_bale.data_ins BETWEEN CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 22:00:00') 
                                  AND CONCAT(CURDATE(), ' 05:59:59')
    AND wheelman_bale.data_ins BETWEEN CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 22:00:00') 
                                   AND CONCAT(CURDATE(), ' 05:59:59')
GROUP BY 
    code_plastic.code
LIMIT 100;
```

---

### **Explanation of Fixes:**
1. **Correct Date Range Calculation**
   - `DATE_SUB(CURDATE(), INTERVAL 1 DAY)` gets **yesterday's date**.
   - `CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 22:00:00')` generates **yesterday's 22:00:00**.
   - `CONCAT(CURDATE(), ' 05:59:59')` generates **today's 05:59:59**.
   - The `BETWEEN` clause ensures we capture records **spanning across midnight**.

2. **Fixing Time Conditions**
   - Removed redundant `TIME(column)` conditions.
   - The filtering is now applied correctly within the `BETWEEN` condition.

---

### **Example of Expected Data Filtering**
| code_plastic.code | totale_peso | totale_balle |
|-------------------|------------|-------------|
| 001              | 500.00 kg   | 5           |
| 002              | 320.00 kg   | 3           |
| 003              | 0.00 kg     | 0           |

This query ensures **all plastic codes are displayed**, even if `totale_balle` is `0`.

---

### **Next Steps**
✅ Test the query in your MySQL database.  
✅ Ensure that `data_ins` is stored as a **DATETIME** or **TIMESTAMP** type.  
✅ Modify `pb_wb.id_implant = 1` to match your actual implant filtering needs.  

Let me know if you need further improvements! 🚀

# Possibile soluzione

Query iniziale:
```sql
SELECT 
    code_plastic.code, 
    SUM(wheelman_bale.weight) AS totale_peso,
    COUNT(pb_wb.id_pb) AS totale_balle
FROM 
    code_plastic
LEFT JOIN presser_bale 
    ON presser_bale.id_plastic = code_plastic.code
LEFT JOIN pb_wb 
    ON pb_wb.id_pb = presser_bale.id
LEFT JOIN wheelman_bale
    ON pb_wb.id_wb = wheelman_bale.id
WHERE 
    pb_wb.id_implant = 1
    AND presser_bale.data_ins BETWEEN CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 22:00:00') 
                                  AND CONCAT(CURDATE(), ' 05:59:59')
    AND wheelman_bale.data_ins BETWEEN CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 22:00:00') 
                                   AND CONCAT(CURDATE(), ' 05:59:59')
GROUP BY 
    code_plastic.code
LIMIT 100;
```

Creare due condizioni:
- **Condizione 1**: controllo la data corrente e che il tempo vada solo da `22:00` alle `23:59:59`
- **Condizione 2**: controllo la **data corrente + 1** e che il tempo vada `00:00` alle `05:59:59`