           await pool.query('COMMIT');

            // Pobranie licznika zgłoszeń
            const count = await getSubmissionCount();
            return res.status(200).json({ success: true, total: count });

        } catch (transactionErr) {
            await pool.query('ROLLBACK');
            console.error('Transaction error:', transactionErr);
            return res.status(500).json({ error: 'Transaction error' });
        }

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const config = {
    api: {
        externalResolver: true,
    },
}