#ifndef MAINFORM_H
#define MAINFORM_H

#include <QMainWindow>
#include <QDateTime>
#include <QString>
#include <QFile>
#include <QFileDialog>
#include <QPropertyAnimation>
#include <QMovie>

#include "function.h"

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
    void Month_Display();
    void Month_Day_Calculator();
    void mIMG_LOAD();

private slots:
    void on_maintext_textChanged();
    void on_text_btn_clicked();
    void on_setting_btn_clicked();
    void on_close_btn_clicked();

private:
    QFile *m_file;
    QMovie *movie;
    QString This_Month;
    QString Month_Day;
    int Text_Layout = 90*1.3;
    bool View = false;
    bool isMouseDown;
    TextData mTD;

protected:
   void mousePressEvent(QMouseEvent * event);
   void mouseReleaseEvent(QMouseEvent * event);
   void mouseMoveEvent(QMouseEvent * event);
   void resizeEvent(QResizeEvent* event);
   int m_nMouseClick_X_Coordinate;
   int m_nMouseClick_Y_Coordinate;
};

#endif // MAINFORM_H
