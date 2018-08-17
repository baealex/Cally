#ifndef MAINFORM_H
#define MAINFORM_H

#include <QMainWindow>
#include <QDateTime>
#include <QString>
#include <QFile>

#include <QFileDialog>

#include <QPropertyAnimation>

namespace Ui {
class MainForm;
}

class MainForm : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainForm(QWidget *parent = 0);
    Ui::MainForm *ui;
    ~MainForm();

private slots:
    void on_pushButton_clicked();
    void on_pushButton_2_clicked();
    void on_pushButton_3_clicked();
    void on_maintext_textChanged();

private:
    QFile *m_file;
    QPixmap m_img;

protected:
   void mousePressEvent(QMouseEvent * event);
   void mouseReleaseEvent(QMouseEvent * event);
   void mouseMoveEvent(QMouseEvent * event);
   void resizeEvent(QResizeEvent* event);
   int m_nMouseClick_X_Coordinate;
   int m_nMouseClick_Y_Coordinate;
};

#endif // MAINFORM_H
